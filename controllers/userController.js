const User = require('../models/User');
const UserPlaylist = require('../models/userPlaylist');
const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');
const bcrypt = require('bcryptjs');


function resolveUserId(req) {
    if (req.user.id) return req.user.id;
    return null;
}

async function loadUser(req) {
    const id = resolveUserId(req);
    if (id) {
        return User.findById(id);
    }
    if (req.user.username) {
        return User.findOne({ username: req.user.username });
    }
    return null;
}

const avatarDir = path.join(__dirname, '..', 'public', 'upload', 'avatars');

function ensureAvatarDir() {
    if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true });
    }
}

const allowedAvatarMime = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp'
};

async function getProfileView(req, rep) {
    if (!req.user) {
        return rep.redirect('/login');
    }
    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.redirect('/login');
    }
    const userPlaylists = await UserPlaylist.find({ user: dbUser._id })
        .sort({ updatedAt: -1 })
        .lean();

    const userForView = {
        id: dbUser._id.toString(),
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        avartar: dbUser.avartar || null
    };

    return rep.view('profile.pug', { user: userForView, userPlaylists });
}

async function updateProfile(req, rep) {
    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.code(404).send({ error: 'Không tìm thấy tài khoản' });
    }

    const { username, email } = req.body || {};
    const updates = {};

    if (username !== undefined && String(username).trim()) {
        updates.username = String(username).trim();
    }
    if (email !== undefined && String(email).trim()) {
        const nextEmail = String(email).trim().toLowerCase();
        const taken = await User.findOne({ email: nextEmail, _id: { $ne: dbUser._id } });
        if (taken) {
            return rep.code(400).send({ error: 'Email đã được sử dụng' });
        }
        updates.email = nextEmail;
    }

    if (Object.keys(updates).length === 0) {
        return rep.code(400).send({ error: 'Không có dữ liệu cập nhật' });
    }

    if (updates.username && updates.username.length < 6) {
        return rep.code(400).send({ error: 'Tên người dùng phải từ 6 ký tự' });
    }

    Object.assign(dbUser, updates);
    await dbUser.save();

    const token = req.server.jwt.sign({
        id: dbUser._id.toString(),
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        avartar: dbUser.avartar || null
    });
    rep.setCookie('token', token);

    return rep.send({
        ok: true,
        user: {
            id: dbUser._id.toString(),
            username: dbUser.username,
            email: dbUser.email,
            avartar: dbUser.avartar || null
        }
    });
}

async function changePassword(req, rep) {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
        return rep.code(400).send({ error: 'Vui lòng nhập đủ mật khẩu' });
    }
    if (String(newPassword).length < 6) {
        return rep.code(400).send({ error: 'Mật khẩu mới phải từ 6 ký tự' });
    }

    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.code(404).send({ error: 'Không tìm thấy tài khoản' });
    }

    const match = await bcrypt.compare(currentPassword, dbUser.password);
    if (!match) {
        return rep.code(400).send({ error: 'Mật khẩu hiện tại không đúng' });
    }

    const salt = await bcrypt.genSalt(10);
    dbUser.password = await bcrypt.hash(newPassword, salt);
    await dbUser.save();

    return rep.send({ ok: true, message: 'Đã đổi mật khẩu' });
}

async function uploadAvatar(req, rep) {
    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.code(404).send({ error: 'Không tìm thấy tài khoản' });
    }

    const data = await req.file();
    if (!data) {
        return rep.code(400).send({ error: 'Chưa chọn file ảnh' });
    }

    const ext = allowedAvatarMime[data.mimetype];
    if (!ext) {
        return rep.code(400).send({ error: 'Chỉ chấp nhận JPEG, PNG, GIF hoặc WebP' });
    }

    ensureAvatarDir();
    const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
    const filepath = path.join(avatarDir, filename);
    await pipeline(data.file, fs.createWriteStream(filepath));

    const publicUrl = `/upload/avatars/${filename}`;
    if (dbUser.avartar && dbUser.avartar.startsWith('/upload/avatars/')) {
        const oldPath = path.join(__dirname, '..', 'public', dbUser.avartar.replace(/^\//, ''));
        try {
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (_) { /* ignore */ }
    }

    dbUser.avartar = publicUrl;
    await dbUser.save();

    const token = req.server.jwt.sign({
        id: dbUser._id.toString(),
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        avartar: dbUser.avartar
    });
    rep.setCookie('token', token);

    return rep.send({ ok: true, avartar: publicUrl });
}

async function listUserPlaylists(req, rep) {
    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.code(404).send({ error: 'Không tìm thấy tài khoản' });
    }
    const items = await UserPlaylist.find({ user: dbUser._id })
        .sort({ updatedAt: -1 })
        .lean();
    return rep.send(items);
}

async function createUserPlaylist(req, rep) {
    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.code(404).send({ error: 'Không tìm thấy tài khoản' });
    }

    const { name, description, isPublic } = req.body || {};
    const trimmed = name != null ? String(name).trim() : '';
    if (!trimmed) {
        return rep.code(400).send({ error: 'Tên playlist là bắt buộc' });
    }

    const pl = await UserPlaylist.create({
        user: dbUser._id,
        name: trimmed,
        description: description != null ? String(description).trim() : '',
        isPublic: isPublic !== false && isPublic !== 'false'
    });

    return rep.code(201).send(pl.toObject());
}

async function updateUserPlaylist(req, rep) {
    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.code(404).send({ error: 'Không tìm thấy tài khoản' });
    }

    const pl = await UserPlaylist.findOne({ _id: req.params.id, user: dbUser._id });
    if (!pl) {
        return rep.code(404).send({ error: 'Không tìm thấy playlist' });
    }

    const { name, description, isPublic } = req.body || {};
    if (name !== undefined) {
        const t = String(name).trim();
        if (!t) {
            return rep.code(400).send({ error: 'Tên playlist không hợp lệ' });
        }
        pl.name = t;
    }
    if (description !== undefined) {
        pl.description = String(description).trim();
    }
    if (isPublic !== undefined) {
        pl.isPublic = Boolean(isPublic === true || isPublic === 'true');
    }

    await pl.save();
    return rep.send(pl.toObject());
}

async function deleteUserPlaylist(req, rep) {
    const dbUser = await loadUser(req);
    if (!dbUser) {
        return rep.code(404).send({ error: 'Không tìm thấy tài khoản' });
    }

    const result = await UserPlaylist.deleteOne({ _id: req.params.id, user: dbUser._id });
    if (result.deletedCount === 0) {
        return rep.code(404).send({ error: 'Không tìm thấy playlist' });
    }
    return rep.send({ ok: true });
}

module.exports = {
    getProfileView,
    updateProfile,
    changePassword,
    uploadAvatar,
    listUserPlaylists,
    createUserPlaylist,
    updateUserPlaylist,
    deleteUserPlaylist
};
