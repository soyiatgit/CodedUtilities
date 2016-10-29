
/*
This directive was coded to provide a word limit based validation for various 
fields of the application. This uses ngModelCtrl to reset the values after
It caters for changes on copy and paste and also allows
for copying text without triggering a change.

Date of Draft : 28-10-2016
Author: Saurabh Tiwari
*/
(function(module){
	
    module.directive('wordLimit', wordLimitFn);

    wordLimitFn.$inject = [];

    function wordLimitFn() {
        var directive = {
            require: 'ngModel',
            restrict: 'A',
            scope: true,
            link: wordLimitLinkFn
        };

        return directive;

        function wordLimitLinkFn(scope, elm, attr, ngModelCtrl) {
            var validateData = function (e) {
                var value = elm.val();
                if (attr.words) {
                    if (e.type === "paste") {
                        e.preventDefault();
                        if ((value && value.match(/\S+/g) && value.match(/\S+/g).length <= attr.limit) || value.match(/\S+/g) === null) {
                            if (e.originalEvent.clipboardData)
                                var newData = value.slice(0, this.selectionStart) + e.originalEvent.clipboardData.getData('text') + value.slice(this.selectionEnd, value.length);
                            else
                                //this is required as IE do not support clipboardData on event rather it supports it on window object.
                                var newData = value.slice(0, this.selectionStart) + window.clipboardData.getData('text') + value.slice(this.selectionEnd, value.length);

                            var valid = newData.split(/\s+/, attr.limit).join(" ");
                            elm.val(valid);
                            ngModelCtrl.$setViewValue(valid);
                        }
                    }
                    if (value && value.match(/\S+/g) && value.match(/\S+/g).length >= attr.limit && e.which === 32 && e.type !== "paste") {
                        e.preventDefault();
                        var valid = value.split(/\s+/, attr.limit).join(" ");
                        elm.val(valid);
                        ngModelCtrl.$setViewValue(valid);
                    }
                }
                else {
                    if (e.type === "paste") {
                        e.preventDefault();
                        if (value || value === "") {
                            if (e.originalEvent.clipboardData)
                                var newData = value.slice(0, this.selectionStart) + e.originalEvent.clipboardData.getData('text') + value.slice(this.selectionEnd, value.length);
                            else
                                //this is required as IE do not support clipboardData on event rather it supports it on window object.
                                var newData = value.slice(0, this.selectionStart) + window.clipboardData.getData('text') + value.slice(this.selectionEnd, value.length);

                            var valid = newData.slice(0, attr.limit);
                            elm.val(valid);
                            ngModelCtrl.$setViewValue(valid);
                        }
                    }
                    else {
                        if (value.length >= attr.limit && e.which !== 8 && e.which !== 46 && e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40 && e.which !== 35 && e.which !== 36) { //allowing backspace delete and arrow/home/end movements
                            e.preventDefault();
                        }
                    }
                }
            }

            elm.bind('keydown', validateData);
            elm.bind('paste', validateData);
        }

    }
}(angular.module("ModuleName"))); 
