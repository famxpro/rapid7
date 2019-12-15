function getQsValue(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return '';
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var $resource = Vue.component('block-item',
    {
        props: ['item', 'index', 'eventTypeText', 'topicText', 'featured', 'index', 'blockCount'],
        template: '#block-item-template',
        data: function () {
            return {}
        },
        computed: {
            isSameDay: function () {
                return moment(this.item.EndDate).isSame(this.item.StartDate, 'day');
            },
            isSameMonth: function () {
                return moment(this.item.EndDate).isSame(this.item.StartDate, 'month');
            },
            dateValue: function () {
                var momentStartDate = moment(this.item.StartDate);
                var momentEndDate = moment(this.item.EndDate);

                if (this.isSameDay)
                    return momentStartDate.format('MMM D, YYYY');

                if (this.isSameMonth)
                    return momentStartDate.format('MMM D') + '-' + momentEndDate.format('D, YYYY');

                return momentStartDate.format('MMM D, YYYY') + ' - ' + momentEndDate.format('MMM D, YYYY');
            }

        },
        filters: {
            moment: function (date, format) {
                return moment(date).format(format);
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
        var self = this;

        self.setFilterParam('t', self.filters.topics, self.selectedFilters.topics);
        self.setFilterParam('r', self.filters.regions, self.selectedFilters.regions);
        self.setFilterParam('e', self.filters.eventTypes, self.selectedFilters.eventTypes);

        Vue.nextTick(function () {
            self.isLoaded = true;
        });
    },
    data: {
        blocks: model.blocks,
        featuredBlock: model.featuredBlock,
        filteredBlocks: model.blocks,
        filters: {
            regions: model.filters.regions,
            eventTypes: model.filters.eventTypes,
            topics: model.filters.topics
        },
        selectedFilters: {
            regions: [],
            eventTypes: [],
            topics: []
        },
        pageIndex: 1,
        pageSize: model.pageSize,
        isLoading: true,
        isLoaded: false
    },
    methods: {
        setFilterParam: function (key, filters, selectedFilters) {
            var self = this;

            if (getQsValue(key) !== '') {
                var prodName = getQsValue(key);

                // Try to find matching product filter
                var match = filters.filter(function (prod) {
                    return prod.label == prodName;
                })[0];

                // Found
                if (match != null) {
                    // Add product filter
                    selectedFilters.push(match);

                    // Apply filters
                    self.applyFilters();
                }
            }
        },
        applyFilters: function () {
            var self = this;

            // Reset paging
            self.pageIndex = 1;

            // Apply filters
            var filteredBlocks = self.blocks.filter(function (block) {
                var regionMatch = false,
                    eventTypeMatch = false,
                    topicMatch = false;

                // Regions: Iterate selected filters
                for (var i = 0; i < self.selectedFilters.regions.length; i++) {
                    // Check for match
                    if (self.selectedFilters.regions[i].value === block.Region) {
                        regionMatch = true;
                        break;
                    }
                }

                // If no region filters, set flag to true
                if (self.selectedFilters.regions.length === 0) regionMatch = true;



                // Event Types: Iterate selected filters
                for (var ii = 0; ii < self.selectedFilters.eventTypes.length; ii++) {
                    // Check for match
                    if (self.selectedFilters.eventTypes[ii].value === block.EventType) {
                        eventTypeMatch = true;
                        break;
                    }
                }

                // If no eventTypes filters, set flag to true
                if (self.selectedFilters.eventTypes.length === 0) eventTypeMatch = true;



                // Topics: Iterate selected filters
                for (var ii = 0; ii < self.selectedFilters.topics.length; ii++) {
                    // Check for match
                    if (self.selectedFilters.topics[ii].value === block.Topic) {
                        topicMatch = true;
                        break;
                    }
                }

                // If no eventTypes filters, set flag to true
                if (self.selectedFilters.topics.length === 0) topicMatch = true;


                return (regionMatch && eventTypeMatch && topicMatch);
            });

            this.filteredBlocks = filteredBlocks;
        },
        selectFilter: function (filter, arr) {
            if (arr.indexOf(filter) === -1)
                arr.push(filter);
            else
                arr.remove(filter);

            if (!Foundation.MediaQuery.atLeast('medium')) return;

            this.applyFilters();
        },
        clearFilters: function () {
            this.selectedFilters.regions = [];
            this.selectedFilters.eventTypes = [];
            this.selectedFilters.topics = [];

            this.applyFilters();
        },
        getEventType: function (id) {
            return this.filters.eventTypes.filter(function (f) {
                return f.value == id;
            })[0].label;
        },
        getTopic: function (id) {
            return this.filters.topics.filter(function (f) {
                return f.value == id;
            })[0].label;
        },
    },
    computed: {
        resultsToShow: function () {
            return this.pageIndex * this.pageSize;
        },
        showLoadMore: function () {
            return this.resultsToShow < this.filteredBlocks.length;
        },
        totalBlockCount: function() {
            if (this.filteredBlocks.length > this.resultsToShow) return this.resultsToShow;

            return this.filteredBlocks.length;
        }
    },
    watch: {
        'pageIndex': function () {
            Foundation.reInit('equalizer');
        }
    }
});
