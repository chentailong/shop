module.exports = {
    upload: function(file) {
        var app = getApp();
        function start(files) {
            "function" == typeof file.start && file.start(files), wx.uploadFile({
                url: file.url || app.api.default.upload_image,
                filePath: files.path,
                name: file.name || "image",
                formData: file.data || {},
                success: function(res) {
                    200 == res.statusCode ? "function" == typeof file.success && (res.data = JSON.parse(res.data),
                        file.success(res.data)) : "function" == typeof file.error && file.error("上传错误：" + res.statusCode + "；" + res.data),
                        file.complete();
                },
                fail: function(err) {
                    "function" == typeof file.error && file.error(err.errMsg), file.complete();
                }
            });
        }
        (file = file || {}).complete = file.complete || function() {}, file.data = file.data || {}, wx.chooseImage({
            count: 1,
            success: function(res) {
                if (res.tempFiles && 0 < res.tempFiles.length) {
                    var files = res.tempFiles[0];
                    start(files);
                } else "function" == typeof file.error && file.error("请选择文件"), file.complete();
            },
            fail: function(e) {
                "function" == typeof file.error && (file.error("请选择文件"), file.complete());
            }
        });
    }
};