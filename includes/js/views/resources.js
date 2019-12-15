Vue.config.debug = true;

//Vue.filter('formatClass',
//    function (value) {
//        return value.trim().replace(/[^a-z0-9]/g, function (s) {
//            var c = s.charCodeAt(0);
//            if (c == 32) return '';
//            if (c >= 65 && c <= 90) return s.toLowerCase();
//            return ('000' + c.toString(16)).slice(-4);
//        });
//    });

var $resource = Vue.component('resource',
    {
        props: ['item', 'index'],
        template: '#resource-template',
        data: function () {
            return {}
        },
        methods: {
            configureResourceForm: function () {
                if (!this.item.IsGated) return;

                // Found in utils.js
                $.app.utils.openResourceForm({
                    title: this.item.Title,
                    desc: this.item.Content,
                    assetName: this.item.MarketoAssetName,
                    assetUrl: this.item.Link
                });
            }
        },
        computed: {
            resourceImgUrl: function () {
                return this.item.ThumbnailImageUrl == '' ? '/includes/img/resources-default-image.png' : this.item.ThumbnailImageUrl;
            }
        }
    });




var $main = new Vue({
    el: 'body',
    created: function () {
        var self = this;
        Vue.nextTick(function () {
            self.isLoading = false;
        });
    },
    ready: function () {
        this.showLoadMore = model.showLoadMore;
    },
    data: {
        pageIndex: 0,
        resources: model.resources,
        filters: model.filters,
        showLoadMore: true,
        selectedProductFilters: model.selectedProductFilters,
        selectedTopicsFilters: model.selectedTopicFilters,
        selectedTypeFilters: model.selectedTypeFilters,
        showMoreTypeFilters: false,
        showMoreTopicFilters: false,
        maxFilters: 6,
        isLoading: true,
    },
    methods: {
        nextPage: function () {
            this.pageIndex++;
            this.fetchData();
        },
        filterProducts: function (filter) {
            if (this.selectedProductFilters.indexOf(filter) === -1)
                this.selectedProductFilters.push(filter);
            else
                this.selectedProductFilters.remove(filter);

            if (!Foundation.MediaQuery.atLeast('medium')) return;

            this.resources = [];
            this.pageIndex = 0;
            this.fetchData();
        },
        filterTopics: function (filter) {
            if (this.selectedTopicsFilters.indexOf(filter) === -1)
                this.selectedTopicsFilters.push(filter);
            else
                this.selectedTopicsFilters.remove(filter);

            if (!Foundation.MediaQuery.atLeast('medium')) return;

            this.resources = [];
            this.pageIndex = 0;
            this.fetchData();
        },
        filterTypes: function (filter) {
            if (this.selectedTypeFilters.indexOf(filter) === -1)
                this.selectedTypeFilters.push(filter);
            else
                this.selectedTypeFilters.remove(filter);

            if (!Foundation.MediaQuery.atLeast('medium')) return;

            this.resources = [];
            this.pageIndex = 0;
            this.fetchData();
        },
        fetchData: function () {
            var self = this;

            self.isLoading = true;

            var qsValues = 'pageIndex=' + self.pageIndex +
                '&products=' + encodeURIComponent(self.selectedProductFilters.join(',')) +
                '&types=' + encodeURIComponent(self.selectedTypeFilters.join(',')) +
                '&topics=' + encodeURIComponent(self.selectedTopicsFilters.join(','));

            $.ajax({
                url: '/api/resources?' + qsValues,
                dataType: 'json',
                success: function (data) {
                    //console.log('[fetchData.done]', data.Resources);

                    // Set view data
                    var resultCount = data.Resources.length;
                    for (var i = 0; i < resultCount; i++) {
                        self.resources.push(data.Resources[i]);
                    }

                    self.showLoadMore = data.ShowLoadMore;

                    Vue.nextTick(function () {
                        $('.resources .container .mix').css('display', 'inline-block');

                    });
                },
                complete: function () {
                    self.isLoading = false;

                    Vue.nextTick(function () {
                        Foundation.reInit('equalizer');
                    });
                }
            });

        },
        clearFilters: function () {
            this.selectedProductFilters = [];
            this.selectedTopicsFilters = [];
            this.selectedTypeFilters = [];
            this.pageIndex = 0;
            this.resources = [];

            this.fetchData();
        },
        applyFilters: function () {
            this.fetchData();
        }
    }
});
