Vue.component('block-item',
    {
        props: ['item', 'index', 'blockCount'],
        template: '#block-item-template',
        data: function() {
            return {}
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

        Vue.nextTick(function () {
            self.isLoaded = true;
        self.applyFilters();
        });

    },
    data: {
        blocks: model.blocks,
        filteredBlocks: model.blocks,
        filters: {
            regions: model.filters.regions,
            products: model.filters.products,
            industries: model.filters.industries,
            types: model.filters.types,
            sizes: model.filters.sizes
        },
        selectedFilters: {
            regions: model.selectedFilters.regions,
            products: model.selectedFilters.products,
            industries: model.selectedFilters.industries,
            types: [],
            sizes: model.selectedFilters.sizes
        },
        pageIndex: 1,
        pageSize: model.pageSize,
        isLoading: true,
        isLoaded: false
    },
    methods: {
        applyFilters: function () {
            var self = this;

            // Reset paging
            self.pageIndex = 1;

            // Apply filters
            var filteredBlocks = self.blocks.filter(function (block) {
                var regionMatch = false,
                    productMatch = false,
                    industryMatch = false,
                    typeMatch = false,
                    sizeMatch = false;

                // Regions: Iterate selected filters
                for (var i = 0; i < self.selectedFilters.regions.length; i++) {
                    // Check for match
                    for (var x = 0; x < block.RegionsList.length; x++) {
                        // If found, set flag
                        if (self.selectedFilters.regions[i].value === block.RegionsList[x].toString()) {
                            regionMatch = true;
                            break;
                        }
                    }
                }

                // If no region filters, set flag to true
                if (self.selectedFilters.regions.length === 0) regionMatch = true;

                // Products: Iterate selected filters
                for (var i = 0; i < self.selectedFilters.products.length; i++) {
                    // Check for match
                    for (var x = 0; x < block.ProductsList.length; x++) {
                        // If found, set flag
                        if (self.selectedFilters.products[i].value === block.ProductsList[x].toString()) {
                            productMatch = true;
                            break;
                        }
                    }
                }
                // If no product filters, set flag to true
                if (self.selectedFilters.products.length === 0) productMatch = true;


                // Industries: Iterate selected filters
                for (var i = 0; i < self.selectedFilters.industries.length; i++) {
                    // Check for match
                    for (var x = 0; x < block.IndustriesList.length; x++) {
                        // If found, set flag
                        if (self.selectedFilters.industries[i].value === block.IndustriesList[x].toString()) {
                            industryMatch = true;
                            break;
                        }
                    }
                }
                // If no industry filters, set flag to true
                if (self.selectedFilters.industries.length === 0) industryMatch = true;


                // Types: Iterate selected filters
                for (var i = 0; i < self.selectedFilters.types.length; i++) {
                    // Check for match
                    for (var x = 0; x < block.TechTypesList.length; x++) {
                        // If found, set flag
                        if (self.selectedFilters.types[i].value === block.TechTypesList[x].toString()) {
                            typeMatch = true;
                            break;
                        }
                    }
                }
                // If no type filters, set flag to true
                if (self.selectedFilters.types.length === 0) typeMatch = true;


                // Sizes: Iterate selected filters
                for (var i = 0; i < self.selectedFilters.sizes.length; i++) {
                    // Check for match
                    for (var x = 0; x < block.SizesList.length; x++) {
                        // If found, set flag
                        if (self.selectedFilters.sizes[i].value === block.SizesList[x].toString()) {
                            sizeMatch = true;
                            break;
                        }
                    }
                }
                // If no type filters, set flag to true
                if (self.selectedFilters.sizes.length === 0) sizeMatch = true;

                //console.log(regionMatch,
                //    productMatch,
                //    industryMatch,
                //    typeMatch,
                //    sizeMatch);

                return (regionMatch &&
                    productMatch &&
                    industryMatch &&
                    typeMatch &&
                    sizeMatch);
            });

            this.filteredBlocks = filteredBlocks;

            Vue.nextTick(function() {
                Foundation.reInit('equalizer');
            });
        },
        hasFilter: function (filter, list) {
            if (list === null)
                return false;

            for (var i = 0; i < list.length; i++) {
                if (list[i].label === filter.label)
                    return true;
            } 

            return false;
        },
        selectFilter: function (filter, arr) {
            console.log(filter);

            if (arr.indexOf(filter) === -1)
                arr.push(filter);
            else
                arr.remove(filter);

            if (!Foundation.MediaQuery.atLeast('medium')) return;

            this.applyFilters();
        },
        clearFilters: function () {
            this.selectedFilters.regions = [];
            this.selectedFilters.products = [];
            this.selectedFilters.industries = [];
            this.selectedFilters.type = [];
            this.selectedFilters.size = [];

            this.applyFilters();
        }
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
        },
        filterCount: function () {
            var self = this;

            return self.selectedFilters.regions.length +
                self.selectedFilters.products.length +
                self.selectedFilters.industries.length +
                self.selectedFilters.types.length +
                self.selectedFilters.sizes.length;
        }
    },
    watch: {
        'pageIndex': function () {
            Foundation.reInit('equalizer');
        }
    }
});
