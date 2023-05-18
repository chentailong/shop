var area_picker = {
    page: null,
    data: null,
    old_value: [0, 0, 0],
    result: [null, null, null],
    init: function (res) {
        var that = this;
        that.page = res.page, that.data = res.data, that.page.showAreaPicker = function () {
            that.page.setData({
                area_picker_show: !0
            });
        }, that.page.hideAreaPicker = function () {
            that.page.setData({
                area_picker_show: !1
            });
        };
        var list = that.data[0].list || [], district_list = [];
        return 0 < list.length && (district_list = list[0].list || []), that.page.setData({
            area_picker_province_list: that.data,
            area_picker_city_list: list,
            area_picker_district_list: district_list
        }), that.result[0] = that.data[0] || null, that.data[0].list && (that.result[1] = that.data[0].list[0],
        that.data[0].list[0].list && (that.result[2] = that.data[0].list[0].list[0])), that.page.areaPickerChange = function (res) {
            var value0 = res.detail.value[0], value1 = res.detail.value[1], value2 = res.detail.value[2];
            res.detail.value[0] != that.old_value[0] && (value2 = value1 = 0, list = that.data[value0].list, district_list = list[0].list,
                that.page.setData({
                    area_picker_city_list: [],
                    area_picker_district_list: []
                }), setTimeout(function () {
                that.page.setData({
                    area_picker_city_list: list,
                    area_picker_district_list: district_list
                });
            }, 0)), res.detail.value[1] != that.old_value[1] && (value2 = 0, district_list = that.data[value0].list[value1].list,
                that.page.setData({
                    area_picker_district_list: []
                }), setTimeout(function () {
                that.page.setData({
                    area_picker_district_list: district_list
                });
            }, 0)), res.detail.value[2], that.old_value[2], that.old_value = [value0, value1, value2], that.result[0] = that.data[value0],
                that.result[1] = that.data[value0].list[value1], that.result[2] = that.data[value0].list[value1].list[value2];
        }, that.page.areaPickerConfirm = function () {
            that.page.hideAreaPicker(), that.page.onAreaPickerConfirm && that.page.onAreaPickerConfirm(that.result);
        }, this;
    }
};

module.exports = area_picker;