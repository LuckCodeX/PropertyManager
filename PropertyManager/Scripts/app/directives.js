/**
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - vectorMap
 *  - sparkline
 *  - icheck
 *  - ionRangeSlider
 *  - dropZone
 *  - responsiveVideo
 *  - chatSlimScroll
 *  - customValid
 *  - fullScroll
 *  - closeOffCanvas
 *  - clockPicker
 *  - landingScrollspy
 *  - fitHeight
 *  - iboxToolsFullScreen
 *  - slimScroll
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'Deera Coffee | Super Admin';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Deera Coffee | ' + toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();

            });
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function () {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            }
        }
    };
}

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};


function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
        }
    }
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function () {
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, $attrs, ngModel) {
            return $timeout(function () {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function (newValue) {
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function (event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function () {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function (scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 5,
            init: function () {
                scope.files.push({ file: 'added' });
                this.on('success', function (file, json) {
                });
                this.on('addedfile', function (file) {
                    scope.$apply(function () {
                        alert(file);
                        scope.files.push({ file: 'added' });
                    });
                });
                this.on('drop', function (file) {
                    alert('file');
                });
            }
        });
    }
}

/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

/**
 * customValid - Directive for custom validation example
 */
function customValid() {
    return {
        require: 'ngModel',
        link: function (scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function () {

                // You can call a $http method here
                // Or create custom validation

                var validText = "Inspinia";

                if (scope.extras == validText) {
                    c.$setValidity('cvalid', true);
                } else {
                    c.$setValidity('cvalid', false);
                }

            });
        }
    }
}


/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * slimScroll - Directive for slimScroll with custom height
 */
function slimScroll($timeout) {
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.clockpicker();
        }
    };
};


/**
 * landingScrollspy - Directive for scrollspy in landing page
 */
function landingScrollspy() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

function ngConfirmClick() {
    return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;
            element.bind('click', function (event) {
                if (window.confirm(msg)) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
}

function fileRead() {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                if (changeEvent.target.files[0].size >= 512000) {
                    alert("Image too large! Max size is 500kb");
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    if (scope.fileread.length > 10) {
                        alert("Max file is 10 images");
                        return;
                    }
                    scope.$apply(function () {
                        var img = {
                            image: "data:image/png;base64," + btoa(loadEvent.target.result),
                            is_delete: false,
                            id: 0
                        }
                        scope.fileread.push(img);
                    });
                }
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}

function fileReaded() {
    return {
        scope: {
            filereaded: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                if (changeEvent.target.files[0].size >= 512000) {
                    alert("Image too large! Max size is 500kb");
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.filereaded = "data:image/png;base64," + btoa(loadEvent.target.result);
                    });
                }
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}

function openHour() {
    return {
        scope: {
            minutes: "="
        },
        link: function (scope, element, attributes) {
            scope.minutes = Math.floor(scope.minutes / 60) + ":" + Math.floor(scope.minutes % 60);
        }
    }

}

function uploadImg() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.uploadImg);
            element.bind('change', onChangeHandler);
        }
    }
}

function uploadFiles() {
    return {
        scope: true,        //create a new scope  
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element  
                for (var i = 0; i < files.length; i++) {
                    //emit event upward  
                    scope.$emit("seletedFile", { file: files[i] });
                }
            });
        }
    };
}

function googleplace() {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            details: '=?',
            //listcity: '='
        },
        link: function (scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {
                    country: 'vn'
                }
            };

            var autocomplete = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                scope.$apply(function () {
                    var place = autocomplete.getPlace();
                    // console.log(place);
                    scope.details.Latitude = place.geometry.location.lat();
                    scope.details.Longitude = place.geometry.location.lng();
                    scope.details.City = place.address_components.filter(function (component) {
                        if (component.types[0] == "administrative_area_level_1")
                            return true;
                    }).map(function (obj) {
                        return obj.long_name;
                    })[0];
                    model.$setViewValue(element.val());
                });
            });
        }
    };
}

function stringToNumber() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value);
            });
        }
    };
}

function numberToString() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                if (value === undefined)
                    return '';
                return value.toString();
            });
        }
    };
}

function replaceString(str) {
    if (!str)
        return '';
    str = str.toLowerCase();
    str = str.replace(/\ /g, " ");
    str = str.replace(/à|á|ạ|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\”|\“|\"|\[|\]|\?/g, "");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    return str;
};

/**
 *
 * Pass all functions into module
 */
app.directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('responsiveVideo', responsiveVideo)
    .directive('chatSlimScroll', chatSlimScroll)
    .directive('customValid', customValid)
    .directive('fullScroll', fullScroll)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('clockPicker', clockPicker)
    .directive('landingScrollspy', landingScrollspy)
    .directive('fitHeight', fitHeight)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
    .directive('slimScroll', slimScroll)
    .directive('ngConfirmClick', ngConfirmClick)
    .directive('fileread', fileRead)
    .directive('filereaded', fileReaded)
    .directive('openHour', openHour)
    .directive('googleplace', googleplace)
    .directive('uploadImg', uploadImg)
    .directive('stringToNumber', stringToNumber)
    .directive('numberToString', numberToString)
    .directive('uploadFiles', uploadFiles);

app.filter('textNormalFilter', function($log) {
  return function(items, props) {
    var out = [];
    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (replaceString(item[prop].toString()).indexOf(replaceString(text.toString())) !== -1) {
            itemMatches = true;
            break;
          }
        }
        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

