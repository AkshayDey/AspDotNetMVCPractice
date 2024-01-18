var module = angular.module('Des_App', []);

module.directive('dateFix', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            element.on('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(element.val());
                });
            });
        }
    };
});

module.filter('date', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }

        var _date = $filter('date')(new Date(input), 'dd-MMM-yyyy');

        return _date.toUpperCase();

    };
});


module.directive('focus', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {

            elem.bind('keypress', function (e) {
                if (event.which === 13) {
                    event.preventDefault();
                    // Go to next age input                        

                    elem.next()[0].focus();
                }
            });
        }
    }
});

module.service('ProductService', function () {
    //to create unique contact id
    var uid = 1;

    //contacts array to hold list of all contacts
    var contacts = [{
        id: 0,
        'name': 'test',
        'email': 'Shoumen.Das@pacificjeans.com',
        'phone': '111-1111-11'
    }];

    //save method create a new contact if not already exists
    //else update the existing object
    this.save = function (contact) {
        if (contact.id == null) {
            //if this is new contact, add it in contacts array
            contact.id = uid++;
            contacts.push(contact);
        } else {
            //for existing contact, find this contact using id
            //and update it.
            for (i in contacts) {
                if (contacts[i].id == contact.id) {
                    contacts[i] = contact;
                }
            }
        }

    }

    //simply search contacts list for given id
    //and returns the contact object if found
    this.get = function (id) {
        for (i in contacts) {
            if (contacts[i].id == id) {
                return contacts[i];
            }
        }

    }

    //iterate through contacts list and delete 
    //contact if found
    this.delete = function (id) {
        for (i in contacts) {
            if (contacts[i].id == id) {
                contacts.splice(i, 1);
            }
        }
    }

    //simply returns the contacts list
    this.list = function () {
        $http({
            url: '/Product/GetAllProducts',
            method: 'GET'
        }).success(function (Products) {

            return Products;

        }).error(function (error) {
            return null;
        });

    }
});
