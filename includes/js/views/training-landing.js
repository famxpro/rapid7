Vue.config.debug = true;

var $main = new Vue({
    el: 'body',
    ready: function () {
        var self = this;

        // Handle closing of modal windows
        $(document).on('closed.zf.reveal', function () {
            //console.log('[modal closed]');

            // Un-select course
            self.selectedCourse = {
                TimeSlot: '',
                Emr: '',
                Sku: '',
                Region: ''
            };

            self.selectedTitle = '';
        });

        Vue.nextTick(function () {
            self.isLoading = false;
            self.isLoaded = true;
        });
    },
    data: {
        pageId: model.pageId, // Umbraco page ID
        items: model.items, // Training items
        showRegionFilters: model.showRegionFilters,
        filters: {
            regions: [
                { label: 'Americas', value: 'Americas' },
                { label: 'EMEA', value: 'EMEA' },
                { label: 'APAC', value: 'APAC' }
            ],
            topics: model.filters.topics,
            products: model.filters.products,
            dates: model.filters.dates
        },
        selectedFilters: {
            regions: [],
            topics: [],
            products: [],
            dates: []
        },
        isLoading: true,
        isLoaded: false,
        selectedCourse: {
            Emr: '',
            Sku: ''
        },
        selectedTitle: '',
        selectedSubtitle: '',
    },
    computed: {
        results: function () {
            var self = this,
                arr = [];

            for (var i = 0; i < self.items.length; i++) {
                var item = self.items[i];

                if (item.Type == "training") {
                    for (var x = 0; x < item.CourseListing.length; x++) {
                        var course = item.CourseListing[x];

                        var result = {
                            item: item,
                            course: course
                        };

                        arr.push(result);
                    }
                }
                else if (item.Type == "cert") {
                    arr.push({ item: item });
                }
            }

            return arr;
        },
        producTopicFilters: function () {
            var self = this,
                arr = [];

            // Add topics
            for (var i = 0; i < self.filters.topics.length; i++) {
                var item = self.filters.topics[i];
                item.type = "topic";

                arr.push(item);
            }

            // Add products
            for (var i = 0; i < self.filters.products.length; i++) {
                var item = self.filters.products[i];
                item.type = "product";

                arr.push(item);
            }

            //console.log('[producTopicFilters]', arr);

            return arr;
        }
    },
    methods: {
        selectFilter: function (filter, arr) {
            if (arr.indexOf(filter) === -1)
                arr.push(filter);
            else
                arr.remove(filter);

            if (!Foundation.MediaQuery.atLeast('medium')) return;

            this.fetchData();
        },
        clearFilters: function () {
            this.selectedFilters.regions = [];
            this.selectedFilters.products = [];
            this.selectedFilters.dates = [];

            this.fetchData();
        },
        fetchData: function () {
            var self = this;
            self.isLoading = true;

            var qsValues = 'products=' + encodeURIComponent(self.getFilterValues(self.selectedFilters.products)) +
                '&topics=' + encodeURIComponent(self.getFilterValues(self.selectedFilters.topics)) +
                '&regions=' + encodeURIComponent(self.getFilterValues(self.selectedFilters.regions)) +
                '&dates=' + encodeURIComponent(self.getFilterValues(self.selectedFilters.dates));

            $.ajax({
                url: '/api/training/items/' + self.pageId + '?' + qsValues,
                dataType: 'json',
                success: function (result) {
                    self.items = result;
                },
                complete: function () {
                    self.isLoading = false;
                }
            });
        },
        getFilterValues: function (arr) {
            var values = $(arr).map(function () {
                return this.value;
            }).get();

            return values.join(',');
        },
        applyFilters: function () {
            this.fethData();
        },
        selectCourse: function (course, item) {
            this.selectedTitle = item.Title;
            this.selectedSubtitle = course.TimeSlot + ' &#8226; ' + course.Region;
            this.selectedCourse = course;
        },
        selectCert: function (item) {
            this.selectedTitle = item.Title;
            //this.selectedSubtitle = item.Price;

            this.selectedCourse = {
                Emr: item.Emr,
                Sku: item.Sku,
            };
        },
        submitForm: function () {
            //console.log('[submitForm]');

            clearErrors();

            validateForm("trainingModal",
                function (isValid) {
                    if (isValid) {
                        $("#trainingModal").submit();
                        //console.log('[submitForm] form is valid. submitting...');
                    }
                });
        }
    }
});
