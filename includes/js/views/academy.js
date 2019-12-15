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
        selectedAcademyTopicFilters: model.selectedAcademyTopicFilters,
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
        filterAcademyTopics: function (filter) {
            if (this.selectedAcademyTopicFilters.indexOf(filter) === -1)
                this.selectedAcademyTopicFilters.push(filter);
            else
                this.selectedAcademyTopicFilters.remove(filter);

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
                '&academyTopics=' + encodeURIComponent(self.selectedAcademyTopicFilters.join(','));

            $.ajax({
                url: '/api/academy?' + qsValues,
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
            this.selectedAcademyTopicFilters = [];
            this.pageIndex = 0;
            this.resources = [];

            this.fetchData();
        },
        applyFilters: function () {
            this.fetchData();
        }
    }
});
