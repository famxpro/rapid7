var $resource = Vue.component('block-item',
    {
        props: ['item', 'parentBlock', 'index', 'parentBlockIndex'],
        template: '#block-item-template',
        data: function () {
            return {}
        },
        computed: {
            uniqueId: function () {
                var suffix = this.item.Name.length >= 2
                    ? this.item.Name.substring(0, 2)
                    : this.item.Name;

                return this.index + '-' + this.item.Id + '-' + suffix;
            },
            isOverlayVisible: function () {
                return this.item.Description != null || this.item.WebsiteUrl != '';
            },
            isBlockVisible: function() {
                return this.$parent.isBlockVisible(this.item);
            },
            hasModal: function() {
                return this.item.Description != null;
            },
            hasUrl: function() {
                return !this.hasModal && this.item.Description == null && this.isOverlayVisible;
            },
            columnCssClass: function () {
                switch (this.parentBlock.Style) {
                    case "4-up":
                        return "large-3 medium-6 small-12 column";
                    case "6-up":
                        return "large-2 medium-6 small-12 column";
                }

                return "small-12 column";
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

        Vue.nextTick(function() {
            self.isLoaded = true;
        });
    },
    data: {
        blocks: model.blocks,
        filters: model.filters,
        selectedRegions: [],
        isLoading: true,
        isLoaded: false
    },
    methods: {
        selectRegion: function (filter) {
            var self = this,
                selectSubregions = false;

            filter.Selected = !filter.Selected;

            selectSubregions = filter.Selected;

            if (filter.Selected)
                this.selectedRegions.push(filter.Id);
            else
                this.selectedRegions.remove(filter.Id);

            // Find correct top-level region
            var count = self.filters.length;
            for (var i = 0; i < count; i++) {
                if (self.filters[i].Id === filter.Id) {

                    // Add/remove sub-regions
                    var subRegions = self.filters[i].Regions;
                    for (var ii = 0; ii < subRegions.length; ii++) {
                        if (selectSubregions) {
                            subRegions[ii].Selected = true;
                            this.selectedRegions.push(subRegions[ii].Id);
                        }
                        else {
                            subRegions[ii].Selected = false;
                            this.selectedRegions.remove(subRegions[ii].Id);
                        }
                    }

                }
            }
        },
        filterRegion: function (filter) {
            var self = this;

            filter.Selected = !filter.Selected;

            if (filter.Selected)
                this.selectedRegions.push(filter.Id);
            else
                this.selectedRegions.remove(filter.Id);
        },
        clearFilters: function () {
            var self = this;

            // Find correct top-level region
            var count = self.filters.length;
            for (var i = 0; i < count; i++) {

                var filter = self.filters[i];
                filter.Selected = false;
                self.selectedRegions.remove(filter.Id);

                var subRegions = self.filters[i].Regions;
                for (var ii = 0; ii < subRegions.length; ii++) {
                    subRegions[ii].Selected = false;
                    self.selectedRegions.remove(subRegions[ii].Id);
                }
            }
        },
        toggleFilter: function (filter) {
            filter.Expanded = !filter.Expanded;
        },
        isBlockVisible: function (blockItem) {
            if (blockItem.Regions == null) return false;

            var itemRegions = blockItem.Regions.split(','),
                selectedCount = this.selectedRegions.length,
                matchCount = 0;

            if (selectedCount === 0) return true;

            for (var i = 0; i < selectedCount; i++) {
                if (itemRegions.indexOf(this.selectedRegions[i].toString()) > -1) {
                    matchCount++;
                }
            }

            return (matchCount === selectedCount);
        },
        getResultsCount: function (block) {
            var selectedCount = 0;

            for (var i = 0; i < block.BlockItems.length; i++) {
                if (this.isBlockVisible(block.BlockItems[i]))
                    selectedCount++;
            }

            return selectedCount;
        }
    }
});
