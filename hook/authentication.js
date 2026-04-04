async function authentication(fastify, options) {
    // Đăng ký hook onRequest cho tất cả các route cần authentication
    fastify.addHook('onRequest', async (req, rep) => {
        try {
            const token = req.cookies?.token;
            if (token) {
                // Verify token và gán user vào request
                const user = fastify.jwt.verify(token);
                req.user = user;
            }
            // Nếu không có token, req.user = undefined (không chặn request)
        } catch (err) {
            // Token không hợp lệ, xóa cookie
            rep.clearCookie('token');
            console.log('JWT verification failed:', err.message);
        }
    });
}

module.exports = authentication