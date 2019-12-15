var $resource = Vue.component('block-item',
    {
        props: ['item', 'index', 'parentBlockIndex', 'showTitleBar'],
        template: '#block-item-template',
        data: function () {
            return {}
        },
        computed: {
            columnCssClass: function () {
                //switch (this.parentBlock.Style) {
                //    case "4-up":
                //        return "large-3 medium-6 small-12 column";
                //    case "6-up":
                //        return "large-2 medium-6 small-12 column";
                //}

                return "large-3 medium-6 small-12 column";
            }
        }
    });

function getQsValue(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return '';
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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

        // Check for products value querystring value
        if (getQsValue('p') !== '') {
            var prodName = getQsValue('p');

            // Try to find matching product filter
            var match = self.filters.products.filter(function (prod) {
                return prod.label == prodName;
            })[0];

            // Found
            if (match != null) {
                // Add product filter
                self.selectedFilters.products.push(match);

                // Apply filters
                self.applyFilters();
            }
        }

        // Check for products value querystring value
        if (getQsValue('y') !== '') {
            var val = getQsValue('y');

            // Try to find matching product filter
            var match = self.filters.tech.filter(function (item) {
                return item.label == val;
            })[0];

            // Found
            if (match != null) {
                // Add filter
                self.selectedFilters.tech.push(match);

                // Apply filters
                self.applyFilters();
            }
        }


        Vue.nextTick(function () {
            self.isLoaded = true;
        });
    },
    data: {
        blocks: model.blocks,
        activeBlocks: model.blocks,
        filters: {
            products: model.filters.products,
            tech: model.filters.tech
        },
        selectedFilters: {
            tech: [],
            products: []
        },
        isLoading: true,
        isLoaded: false
    },
    methods: {
        applyFilters: function () {
            var self = this;

            // Apply filters
            var filteredBlocks = self.blocks.filter(function (block) {
                var prodMatch = false,
                    techMatch = false;

                // Products: Iterate selected filters
                for (var i = 0; i < self.selectedFilters.products.length; i++) {
                    // Check for product match
                    for (var x = 0; x < block.ProductsList.length; x++) {
                        // If found, set flag
                        if (self.selectedFilters.products[i].value === block.ProductsList[x]) {
                            prodMatch = true;
                            break;
                        }
                    }
                }

                // If no product filters, set flag to true
                if (self.selectedFilters.products.length === 0) prodMatch = true;

                // Technology types: Iterate selected filters
                for (var ii = 0; ii < self.selectedFilters.tech.length; ii++) {
                    // Check for product match
                    for (var xx = 0; xx < block.TechTypesList.length; xx++) {
                        // If found, set flag
                        if (self.selectedFilters.tech[ii].value === block.TechTypesList[xx]) {
                            techMatch = true;
                            break;
                        }
                    }
                }

                // If no tech filters, set flag to true
                if (self.selectedFilters.tech.length === 0) techMatch = true;

                //console.log(block.Headline, 'prodMatch', prodMatch, '| techMatch', techMatch);

                return (prodMatch && techMatch);
            });


            // Filter by technology types

            this.activeBlocks = filteredBlocks;
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
            this.selectedFilters.tech = [];
            this.selectedFilters.products = [];

            this.applyFilters();
        }
    },
    computed: {
        filteredFeaturedBlocks: function () {
            var self = this;
            return self.activeBlocks.filter(function (block) {
                return block.IsStrategicPartner;
            });
        },
        filteredBlocks: function () {
            var self = this;
            return self.activeBlocks.filter(function (block) {
                return !block.IsStrategicPartner;
            });
        }

    }
});
