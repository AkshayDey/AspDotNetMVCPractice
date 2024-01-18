var module = angular.module('Des_App', ['ngSanitize', 'ui.select', 'kendo.directives', 'ui.filters']);

module.directive('uiSelectRequired', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {

                var determineVal;
                if (angular.isArray(modelValue)) {
                    determineVal = modelValue;
                } else if (angular.isArray(viewValue)) {
                    determineVal = viewValue;
                } else {
                    return false;
                }

                return determineVal.length > 0;
            };
        }
    };
});

module.controller('UserRegistrationController', function ($scope, $http) {
    //$scope.myurl = '..'//'/Courier';
    //global page declarations     
    $scope.filterData = '';
    $scope.reverse = false;
    $scope.pageNo = 1;
    $scope.perPageRecord = 10;
    $scope.totalPageCount = 1;
    $scope.recordStart = 0;
    $scope.recordEnd = $scope.recordStart + $scope.perPageRecord;
    $scope.tempPageNo = 1;
    $scope.EntryPortion = false;
    $scope.chkFlag = false;
    $scope.data =
        {
            "1": "Yes",
            "0": "No"
        };
    $scope.RateFor = [
        {
            "display": "In Bound",
            "value": "inbound"
        },
        {
            "display": "Out Bound",
            "value": "outbound"
        },
        {
            "display": "By Air",
            "value": "air"
        },
        {
            "display": "By Land",
            "value": "land"
        },
    ]
    $scope.ItemTypes = [
        {
            "display": "Cargo",
            "value": "Cargo"
        },
        {
            "display": "Document",
            "value": "Document"
        },
    ]
    $scope.Categories = [
        {
            "display": "In Bound",
            "value": "inbound"
        },
        {
            "display": "Out Bound",
            "value": "outbound"
        },
    ]
    $scope.TransportModes = [
        {
            "display": "By Air",
            "value": "air"
        },
        {
            "display": "By Land",
            "value": "land"
        },
    ]
    $scope.CompanyTypes = [
        {
            "display": "Buyer",
            "value": "Buyer"
        },
        {
            "display": "Supplier",
            "value": "Supplier"
        },
        {
            "display": "Company",
            "value": "Company"
        },
    ]
    $scope.CourierCategories = [
        {
            "display": "International",
            "value": "international"
        },
        {
            "display": "Local",
            "value": "local"
        },
        {
            "display": "Forwarder",
            "value": "forwarder"
        }
    ]
    $scope.trueFalses = [
        {
            "display": "Prepaid  - Cost By Other",
            "value": true
        },
        {
            "display": "Collect  - Cost By Pacific Jeans Ltd.",
            "value": false
        },
    ]
    //SHOW USER ACCESS MODAL
    $scope.usrAccessShowModal = function () {
        $('#usrAccessModal').modal('show');
    };
    $scope.usrAccessHideModal = function () {
        $('#usrAccessModal').modal('hide');
    };

    //SHOW EDIT USER REGISTER MODAL
    $scope.editUserShowModal = function () {
        $('#editUsrRegisterModal').modal('show');
    };
    $scope.editUserHideModal = function () {
        $('#editUsrRegisterModal').modal('hide');
    };

    //SHOW BUYER PREVIEW MODAL
    $scope.ShowBuyerPreviewModal = function () {
        $('#BuyerPreviewModal').modal('show');
    };
    $scope.HideBuyerPreviewModal = function () {
        $('#BuyerPreviewModal').modal('hide');
    };

    //SHOW IMAGE MODAL
    $scope.ShowImageModal = function (proURL) {
        $scope.imgLoad = proURL;
        $('#imgModal').modal('show');
    };
    $scope.HideImageModal = function () {
        $('#imgModal').modal('hide');
    };

    $scope.RequsitionTypes = [
        { type: 'InBound' },
        { type: 'OutBound' }
    ];
    $scope.DesignTypes = [
        {
            "display": "Buyer",
            "value": "1"
        },
        {
            "display": "Own",
            "value": "2"
        }
    ];

    $scope.sideBarReset = function () {
        $http.get('/User/SideMenuReset').then(function () {
            $('#openSidebarMenu').prop('checked', false);
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: data.type });
        });
    }

    //------------------------------------------------------------------Table Page Design------------------------------------------//
    $scope.filterChange = function () {
        if ($scope.filterData != null && $scope.filterData.length > 0) {
            if ($scope.tempPageNo == 1) {
                $scope.tempPageNo = $scope.pageNo;
            }
            $scope.pageNo = 1;
        }
        else {
            $scope.pageNo = $scope.tempPageNo;
            $scope.tempPageNo = 1;
        }

        $scope.recordStartEndSelect();
    };

    $scope.recordStartEndSelect = function () {
        //debugger;
        if ($scope.perPageRecord == undefined || $scope.perPageRecord == null) {
            $scope.perPageRecord = 10;
        }
        $scope.recordStart = ($scope.pageNo - 1) * $scope.perPageRecord;
        $scope.recordEnd = ($scope.recordStart * 1) + ($scope.perPageRecord * 1) - 1;
    }

    $scope.nextPage = function () {
        $scope.pageNo++;
        if ($scope.totalPageCount >= $scope.pageNo) {
            $scope.recordStartEndSelect();
        }
        else {
            $scope.pageNo = 1;
            $scope.recordStartEndSelect();
        }
    };

    $scope.previousPage = function () {
        $scope.pageNo--;
        if ($scope.pageNo > 0) {
            $scope.recordStartEndSelect();
        }
        else {
            $scope.pageNo = $scope.totalPageCount
            $scope.recordStartEndSelect();
        }
    };

    $scope.currentPage = function () {
        if ($scope.pageNo == undefined || $scope.pageNo == null) {
            $scope.pageNo = 1;
        }

        if ($scope.pageNo > $scope.totalPageCount) {
            $scope.pageNo = $scope.totalPageCount
            $scope.recordStartEndSelect();
        }
        else {
            $scope.recordStartEndSelect();
        }
    };

    $scope.GetTotalPage = function (obj) {
        if ($scope.perPageRecord == undefined || $scope.perPageRecord == null) {
            $scope.perPageRecord = 10;
        }

        $scope.totalPageCount = Math.ceil(obj.length / $scope.perPageRecord);
        if ($scope.totalPageCount < $scope.pageNo) {
            $scope.pageNo = $scope.totalPageCount;
        }

        if ($scope.pageNo == 0) {
            $scope.pageNo = 1;
        }
        $scope.recordStartEndSelect();
    };

    $scope.totalPage = function (obj) {
        if (obj.length < 10) {
            $scope.perPageRecord = 10;
        }
        if ($scope.perPageRecord == undefined || $scope.perPageRecord == null) {
            $scope.perPageRecord = 10;
        }
        if ($scope.perPageRecord < 1) {
            $scope.perPageRecord = 10;
        }

        if ($scope.perPageRecord > obj.length && obj.length > 10) {
            $scope.perPageRecord = obj.length;
        }
        $scope.totalPageCount = Math.ceil(obj.length / $scope.perPageRecord);

        return $scope.totalPageCount;
    }

    $scope.changeTotalPageCount = function (obj, perPageRecord) {
        if (perPageRecord == undefined || perPageRecord == null) {
            perPageRecord = 10;
        }

        $scope.perPageRecord = perPageRecord;
        $scope.pageNo = 1;
        $scope.tempPageNo = 1;
        $scope.recordStartEndSelect();
        $scope.GetTotalPage(obj);
    };

    $scope.reloadPage = function () { window.location.reload(); }
    function formatSelection(val) {
        return val.id;
    }
    //------------------------------------------------------------------Table Page Design------------------------------------------//

    $scope.GetBuyerData = function (UserTypeID) {
        $scope.userBuyerTypeChange();
        $scope.editBuyerUserTypeChange();
        $scope.GetAllBuyer();
    }

    $scope.GetAllBuyer = function () {
        $scope.BuyerList = [];
        $http.get('/User/GetAllBuyer').then(function (data) {
            $scope.BuyerList = data.data.buyerList;
            if ($scope.BuyerList.length < 0)
                $.notify(data.message, { globalPosition: 'top right', className: data.type });
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: data.type });
        });
    };

    $scope.GetUserWiseBuyerAccess = function () {
        $scope.UserWiseBuyerList = [];
        $http.get('/User/GetUserWiseBuyerAccess').then(function (data) {
            $scope.UserWiseBuyerList = data.data.buyerList;
            if ($scope.UserWiseBuyerList.length < 0)
                $.notify(data.message, { globalPosition: 'top right', className: data.type });
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: data.type });
        });
    };

    $scope.BuyerChange = function (BuyerId) {
        try {
            $.each($scope.BuyerList, function (key, value) {
                if (BuyerId == value.BuyerID) {
                    $scope.user.BuyerName = value.BuyerName;
                    $scope.duplicateProductCheck();
                    return;
                }
            });
        }
        catch (ex) {
            alert('BuyerChange' + ex.message);
        }
    }

    $scope.EditBuyerChange = function (BuyerId) {
        try {
            $.each($scope.BuyerList, function (key, value) {
                if (BuyerId == value.Buyer_ID) {
                    $scope.lstEditUser.Buyer_Name = value.Buyer_Name;
                    return;
                }
            });
        }
        catch (ex) {
            alert('BuyerChange' + ex.message);
        }
    }

    $scope.ProUploadBuyerChange = function (BuyerId) {
        //debugger;
        try {
            $.each($scope.UserWiseBuyerList, function (key, value) {
                if (BuyerId == value.BuyerID) {
                    $scope.BuyerID = BuyerId;
                    $scope.BuyerName = value.BuyerName;
                    $scope.duplicateProductCheck();
                    return;
                }
            });
            //alert(angular.toJson($scope.BuyerList));
            //alert($scope.BuyerID);
        }
        catch (ex) {
            alert('ProUploadBuyerChange' + ex.message);
        }
    }

    $scope.GetAllCategory = function () {
        $scope.categoryList = [];
        $http.get('/User/GetAllCategory').then(function (data) {
            $scope.categoryList = data.data.categoryList;
            if ($scope.categoryList.length < 0)
                $.notify(data.message, { globalPosition: 'top right', className: data.type });
        }, function (error) {
            $.notify('Error is ' + error.message, { globalPosition: 'top right', className: data.type });
        });
    };

    $scope.CategoryChange = function (CategoryID) {
        try {
            $.each($scope.categoryList, function (key, value) {
                if (CategoryID == value.CategoryID) {
                    $scope.CategoryID = CategoryID;
                    $scope.CategoryName = value.CategoryName;
                    $scope.duplicateProductCheck();
                    return;
                }
            });
        }
        catch (ex) {
            $.notify('CategoryChange' + ex.message);
        }
    }

    $scope.GetAllUnit = function () {
        $scope.unitList = [];
        $http.get('/User/GetAllUnit').then(function (data) {
            $scope.unitList = data.data.unitList;
            if ($scope.unitList.length < 0)
                $.notify(data.message, { globalPosition: 'top right', className: data.type });
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: data.type });
        });
    };

    $scope.UnitChange = function (Unit_ID) {
        try {
            $.each($scope.unitList, function (key, value) {
                if (Unit_ID == value.UnitID) {
                    $scope.UnitID = value.UnitID;
                    $scope.duplicateProductCheck();
                    return;
                }
            });
        }
        catch (ex) {
            alert('UnitChange' + ex.message);
        }
    }

    $scope.DesignTypeChange = function (DesignTypeID) {
        if (DesignTypeID == 1) {
            try {
                $scope.DesignType = DesignTypeID;
                return;
            }
            catch (ex) {
                alert('DesignTypeChange' + ex.message);
            }
        }
        else {
            $scope.Buyer = 'own'
            $scope.BuyerID = 'own';
            $scope.BuyerName = 'Own';
        }
    }

    $scope.ProductInit = function () {
        $scope.GetAllCategory();
        $scope.GetAllUnit();
        $scope.GetUserWiseBuyerAccess();
    }

    $scope.DeleteProductInfo = function (prod) {
        bootbox.confirm({
            message: "Do you want to delete this information?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-primary'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $http.get('/User/DeleteProductData', {
                        params: { productID: prod.ProductID }
                    }).then(function (data) {
                        $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
                        $scope.GetAllProduct();
                    }, function (error) {
                        $.notify(error.data.message, { globalPosition: 'top right', className: error.data.type });
                    });
                }
            }
        });
    }

    //-----------------------------------------User Authentication-----------------------------------------//
    $scope.UserAccessData = function (userAccess) {
        //debugger;
        for (var ind in $scope.lstUsrAccess) {
            if (ind.MenuName == userAccess.MenuName) {
                ind.bShow = userAccess.bShow;
                ind.bEdit = userAccess.bEdit;
                ind.bDelete = userAccess.bDelete;
            }
        }
    }

    $scope.usrAccessSave = function () {
        bootbox.confirm({
            message: "Do you want to save this information?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-primary'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $http({
                        url: '/User/saveUserAccess',
                        method: 'POST',
                        data: JSON.stringify({ userID: $scope.UserID, userName: $scope.UserName, userAccessModals: $scope.lstUsrAccess })
                    }).then(function (data) {
                        $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
                        $scope.closeUserAccess();
                    }, function (data) {
                        $.notify('Error is ' + data.data.message, { globalPosition: 'top right', className: data.data.type });
                    });
                }
            }
        });
    }

    $scope.closeUserAccess = function () {
        $scope.usrAccessHideModal();
        $scope.lstUsrAccess = {};
    }

    $scope.userAccess = function (obj) {
        $scope.lstUsrAccess = {};
        $scope.UserID = obj.UserID;
        $scope.UserName = obj.Username;
        $http.get('/User/getUsrAccessData', {
            params: { uName: obj.Username }
        }).then(function (data) {
            if (data.data.message == "Can't provide access to inactive user!!!")
                $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
            else {
                $scope.usrAccessShowModal();
                $scope.lstUsrAccess = data.data.UserAccesses;
            }
            //alert(angular.toJson($scope.lstUsrAccess));
        }, function (error) {
            $.notify(error.message, { globalPosition: 'top right', className: error.type });
        });
    }
    //-----------------------------------------User Authentication-----------------------------------------//

    //-----------------------------------------Edit User Register------------------------------------------//
    $scope.closeEditUser = function () {
        $scope.editUserHideModal();
        $scope.lstEditUser = {};
    }

    $scope.editUserInfo = function (obj) {
        debugger;
        $scope.sideBarReset();
        $scope.editUserShowModal();
        $scope.lstEditUser = [];
        $scope.UserID = obj.UserID;
        $http.get('/User/editUserRegistrationInfo', {
            params: { userID: obj.UserID }
        }).then(function (data) {
            $scope.lstEditUser = data.data.editUserData;
            if ($scope.lstEditUser.User_Type_ID == 'UT-01') {
                $scope.lstEditUser.UserTypeSA = true;
                $scope.lstEditUser.UserTypeAdmin = false;
                $scope.lstEditUser.UserTypeUser = false;
                $scope.lstEditUser.UserTypeBuyer = false;
            }
            else if ($scope.lstEditUser.User_Type_ID == 'UT-02') {
                $scope.lstEditUser.UserTypeSA = false;
                $scope.lstEditUser.UserTypeAdmin = true;
                $scope.lstEditUser.UserTypeUser = false;
                $scope.lstEditUser.UserTypeBuyer = false;
            }
            else if ($scope.lstEditUser.User_Type_ID == 'UT-03') {
                $scope.lstEditUser.UserTypeSA = false;
                $scope.lstEditUser.UserTypeAdmin = false;
                $scope.lstEditUser.UserTypeUser = true;
                $scope.lstEditUser.UserTypeBuyer = false;
            }
            else if ($scope.lstEditUser.User_Type_ID == 'UT-04') {
                $scope.lstEditUser.UserTypeSA = false;
                $scope.lstEditUser.UserTypeAdmin = false;
                $scope.lstEditUser.UserTypeUser = false;
                $scope.lstEditUser.UserTypeBuyer = true;
            }
            $scope.lstEditUser.ContactNo = parseInt($scope.lstEditUser.ContactNo);
            $scope.lstEditUser.UserFlag = ($scope.lstEditUser.UserFlag ? false : true);
            $scope.logUserType = data.data.logUserType;

            //alert(angular.toJson($scope.lstEditUser));
        }, function (error) {
            $.notify(error.message, { globalPosition: 'top right', className: error.type });
        });
    }

    //$scope.editUserInfo = function (obj) {
    //    debugger;
    //    //$scope.EntryPortion = true;
    //    $http.get('/User/editUserRegistration', {
    //        params: { userID: obj.UserID }
    //    }).then(function (data) {
    //        $scope.user.UserID = data.data.userData.UserID;
    //        $scope.user.Username = data.data.userData.UserName;
    //        if (data.data.userData.UserTypeID == 1)
    //            $scope.user.UserTypeID = true;
    //        else
    //            $scope.user.UserTypeID = false;
    //        $scope.user.Username = data.data.userData.UserName;
    //        $scope.user.UserID = data.data.userData.UserID;
    //        $scope.user.Username = data.data.userData.UserName;
    //    }, function (error) {

    //    });
    //}
    //-----------------------------------------Edit User Register------------------------------------------//

    $scope.getAllUserIndex = function () {
        //debugger;
        $scope.userList = [];
        $scope.GetUserWiseBuyerAccess();
        $http.get('/User/getAllUserIndex').then(function (data) {
            $scope.userList = data.data.userlist;
            $scope.GetTotalPage($scope.userList);
            //alert(angular.toJson($scope.userList));
        }, function (error) {
            $.notify(error.data.message, { globalPosition: 'top right', type: error.data.type });
        });
    }

    //$scope.editProductInfo = function (prod) {
    //    window.location = '../User/ProductUpload';
    //    $scope.prodModel = [];
    //    $http.get('/User/getProductDataToEdit', {
    //        params: { productID: prod.ProductID }
    //    }).then(function (data) {
    //        debugger;
    //        alert(angular.toJson(data.data.prodData));
    //        $scope.ProductID = data.data.prodData.ProductID;
    //        $scope.ProductName = data.data.prodData.ProductName;
    //    }, function (error) {
    //        debugger;
    //        //$.notify(error.message, { globalPosition: 'top right', type: 'warn' });
    //    });
    //}

    //--------------------------------------Check User Register Validity------------------------------------------//
    $scope.checkUserValidity = function (userReg) {
        if (userReg.Username != undefined || userReg.Username != null) {
            if (userReg.FirstName != undefined || userReg.FirstName != null) {
                if (userReg.LastName != undefined || userReg.LastName != null) {
                    if (userReg.Password != undefined || userReg.Password != null) {
                        if (userReg.ConfirmPassword != undefined || userReg.ConfirmPassword != null) {
                            if (userReg.Password == userReg.ConfirmPassword) {
                                if (userReg.UserTypeSA || userReg.UserTypeAdmin || userReg.UserTypeUser || userReg.UserTypeBuyer) {
                                    if (userReg.UserTypeBuyer) {
                                        if (userReg.chkLog != undefined || userReg.chkLog != null) {
                                            if (userReg.BuyerID != undefined || userReg.BuyerID != null) {
                                                return true;
                                            }
                                        }
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    $scope.checkEditUserValidity = function (userReg) {
        debugger;
        if (userReg.UserID != undefined || userReg.UserID != null) {
            if (userReg.Username != undefined || userReg.Username != null) {
                if (userReg.FirstName != undefined || userReg.FirstName != null) {
                    if (userReg.LastName != undefined || userReg.LastName != null) {
                        if ($scope.logUserType == 'UT-01' || ((userReg.oldPassword != undefined || userReg.oldPassword != null) && $scope.logUserType != 'UT-01')) {
                            if (userReg.NewPassword != undefined || userReg.NewPassword != null) {
                                if (userReg.ConfPassword != undefined || userReg.ConfPassword != null) {
                                    if (userReg.NewPassword == userReg.ConfPassword) {
                                        if (userReg.UserTypeSA || userReg.UserTypeAdmin || userReg.UserTypeUser || userReg.UserTypeBuyer) {
                                            if (userReg.UserTypeBuyer) {
                                                if (userReg.LogCheck != undefined || userReg.LogCheck != null) {
                                                    if (userReg.Buyer_ID != undefined || userReg.Buyer_ID != null) {
                                                        return true;
                                                    }
                                                }
                                            }
                                            else {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    //--------------------------------------Check User Register Validity------------------------------------------//


    //----------------------------------------------User Register-------------------------------------------------//
    $scope.DeleteUser = function (userReg) {
        bootbox.confirm({
            message: "Do you want to delete this information?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-primary'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $http.get('/User/DeleteUser', {
                        params: { userID: userReg.UserID }
                    }).then(function (data) {
                        $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
                        $scope.sideBarReset();
                        $scope.getAllUserIndex();
                    }, function (error) {
                        $.notify(error.data.message, { globalPosition: 'top right', className: error.data.type });
                    });
                }
            }
        });
    }

    $scope.userSATypeChange = function () {
        if ($scope.user.UserTypeSA) {
            $scope.user.UserTypeAdmin = false;
            $scope.user.UserTypeUser = false;
            $scope.user.UserTypeBuyer = false;
            $scope.user.BuyerID = null;
            $scope.user.BuyerName = null;
        }
    }

    $scope.userAdminTypeChange = function () {
        if ($scope.user.UserTypeAdmin) {
            $scope.user.UserTypeSA = false;
            $scope.user.UserTypeUser = false;
            $scope.user.UserTypeBuyer = false;
            $scope.user.BuyerID = null;
            $scope.user.BuyerName = null;
        }
    }

    $scope.userTypeChange = function () {
        if ($scope.user.UserTypeUser) {
            $scope.user.UserTypeSA = false;
            $scope.user.UserTypeAdmin = false;
            $scope.user.UserTypeBuyer = false;
            $scope.user.BuyerID = null;
            $scope.user.BuyerName = null;
        }
    }

    $scope.userBuyerTypeChange = function () {
        if ($scope.user.UserTypeBuyer) {
            $scope.user.UserTypeSA = false;
            $scope.user.UserTypeAdmin = false;
            $scope.user.UserTypeUser = false;
        }
    }

    $scope.SaveUserReg = function (userReg) {
        if ($scope.checkUserValidity(userReg)) {
            if (userReg.UserTypeSA)
                userReg.UserTypeID = "UT-01";
            else if (userReg.UserTypeAdmin)
                userReg.UserTypeID = "UT-02";
            else if (userReg.UserTypeUser)
                userReg.UserTypeID = "UT-03";
            else
                userReg.UserTypeID = "UT-04";

            bootbox.confirm({
                message: "Do you want to save this information?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    //debugger;
                    if (result) {
                        $http({
                            url: '/User/UserRegistration',
                            method: 'POST',
                            data: JSON.stringify({ usrReg: userReg })
                        }).then(function (data) {
                            $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
                            if (data.data.message != "User name already exist. Provide another user name.")
                                $scope.EntryPortion = true;
                            $scope.EntryPortion = false;
                            $scope.getAllUserIndex();
                            $scope.user = {};
                        }, function (data) {
                            $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
                        });
                    }
                }
            });
        } else {
            $.notify("Provide correct information", { globalPosition: 'top right', className: 'warn' });
        }
    };

    $scope.editSAUserTypeChange = function () {
        debugger;
        if ($scope.lstEditUser.UserTypeSA) {
            $scope.lstEditUser.UserTypeAdmin = false;
            $scope.lstEditUser.UserTypeUser = false;
            $scope.lstEditUser.UserTypeBuyer = false;
            $scope.lstEditUser.Buyer_ID = null;
            $scope.lstEditUser.Buyer_Name = null;
        }
    }

    $scope.editAdminUserTypeChange = function () {
        debugger;
        if ($scope.lstEditUser.UserTypeAdmin) {
            $scope.lstEditUser.UserTypeSA = false;
            $scope.lstEditUser.UserTypeUser = false;
            $scope.lstEditUser.UserTypeBuyer = false;
            $scope.lstEditUser.Buyer_ID = null;
            $scope.lstEditUser.Buyer_Name = null;
        }
    }

    $scope.editUserTypeChange = function () {
        debugger;
        if ($scope.lstEditUser.UserTypeUser) {
            $scope.lstEditUser.UserTypeSA = false;
            $scope.lstEditUser.UserTypeAdmin = false;
            $scope.lstEditUser.UserTypeBuyer = false;
            $scope.lstEditUser.Buyer_ID = null;
            $scope.lstEditUser.Buyer_Name = null;
        }
    }

    $scope.editBuyerUserTypeChange = function () {
        debugger;
        if ($scope.lstEditUser.UserTypeBuyer) {
            $scope.lstEditUser.UserTypeSA = false;
            $scope.lstEditUser.UserTypeAdmin = false;
            $scope.lstEditUser.UserTypeUser = false;
        }
    }

    $scope.EditUserReg = function (userReg) {
        if ($scope.checkEditUserValidity(userReg)) {
            if (userReg.UserTypeSA)
                userReg.User_Type_ID = "UT-01";
            else if (userReg.UserTypeAdmin)
                userReg.User_Type_ID = "UT-02";
            else if (userReg.UserTypeUser)
                userReg.User_Type_ID = "UT-03";
            else
                userReg.User_Type_ID = "UT-04";

            bootbox.confirm({
                message: "Do you want to update this information?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    //debugger;
                    if (result) {
                        $http({
                            url: '/User/EditUserRegistration',
                            method: 'POST',
                            data: JSON.stringify({ usrReg: userReg })
                        }).then(function (data) {
                            $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
                            $scope.EntryPortion = false;
                            $scope.getAllUserIndex();
                            $scope.lstEditUser = {};
                            $scope.editUserHideModal();
                        }, function (data) {
                            $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
                        });
                    }
                }
            });
        } else {
            $.notify("Provide correct information", { globalPosition: 'top right', className: 'warn' });
        }
    };
    //----------------------------------------------User Register-------------------------------------------------//

    //------------------------------------------Check Login Validity----------------------------------------------//
    $scope.checkLoginUserValidity = function (log) {
        if (log.Username != undefined || log.Username != null || log.Username.Trim() != "") {
            return true;
        }
        return false;
    }

    $scope.checkLoginValidity = function (log) {
        if (log.Username != undefined || log.Username != null || log.Username.Trim() != "") {
            if (log.Password != undefined || log.Password != null || log.Password.Trim() != "") {
                return true;
            }
        }
        return false;
    }
    //------------------------------------------Check Login Validity----------------------------------------------//

    $scope.GetAllProduct = function () {
        $scope.prodList = [];
        //debugger;
        $http.get('/User/GetAllProduct').then(function (data) {
            $scope.prodList = data.data.prodList;
            $scope.GetTotalPage($scope.prodList);
        }, function (error) {
            $.notify('Error is ' + error.data.message, { globalPosition: 'top right', className: error.data.type });
        });
    }

    $scope.loginUserCheck = function (log) {
        if ($scope.checkLoginUserValidity(log)) {
            //debugger;
            $http({
                url: '/User/UserCheck',
                method: 'POST',
                data: JSON.stringify({ login: log })
            }).then(function (data) {
                $scope.chkFlag = data.data.userValidity;
                if (data.data.message.length > 0)
                    $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
            }, function (data) {
                $.notify('Error is ' + data.data.message, { globalPosition: 'top right', className: data.data.type });
            });
        } else {
            $.notify("Provide correct information", { globalPosition: 'top right', className: 'warn' });
        }
    }

    $scope.loginAction = function (log) {
        if ($scope.checkLoginValidity(log)) {
            //debugger;
            $http({
                url: '/User/UserLogin',
                method: 'POST',
                data: JSON.stringify({ login: log })
            }).then(function (data) {
                if (data.data.logCheck > 0 && data.data.CountData.Username != null) {
                    if (data.data.userType == "UT-04")
                        window.location = '../Home/Index';
                    else
                        window.location = '../User/UserRegistration';
                }
                else
                    $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
            }, function (data) {
                $.notify('Error is ' + data.data.message, { globalPosition: 'top right', className: data.data.type });
            });
        } else {
            $.notify("Provide correct information", { globalPosition: 'top right', className: 'warn' });
        }
    }

    //------------------------------------------------Duplicate product check----------------------------------------------//
    $scope.duplicateProductCheck = function () {
        $http.get('/User/duplicateProductCheck', {
            params: {
                Product: $scope.ProductName, categoryID: $scope.CategoryID, UnitID: $scope.UnitID,
                EndUser: $scope.EndUser, WashName: $scope.WashName, ColorName: $scope.ColorName,
                StyleName: $scope.StyleName, BuyerID: $scope.BuyerID
            }
        }).then(function (data) {
            if (data.data.dataCount > 0) {
                $scope.ProductName = '';
                $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
            }
        }, function (error) {
            $.notify('Error is ' + error.data.message, { globalPosition: 'top right', className: error.data.type });
        });
    }
    //------------------------------------------------Duplicate product check----------------------------------------------//

    $scope.threeSixtyImage = function (obj) {
        $scope.img_name = obj.Img_Loc;
    }

    $scope.fill_BuyerName = function (obj) {
        $scope.fill_Buyer = obj.BuyerName;
    }

    //$scope.fill_ProductID = function (ProductID) {
    //    $scope.fill_Product = ProductID;
    //}

    $scope.getAllImage = function (catID, ProdID, EndUser, Style, Color, Wash) {
        //debugger;
        if (catID == null) {
            catID = '%';
        }
        if (ProdID == null) {
            ProdID = '%';
        }
        if (EndUser == null) {
            EndUser = '%';
        }
        if (Style == null) {
            Style = '%';
        }
        if (Color == null) {
            Color = '%';
        }
        if (Wash == null) {
            Wash = '%';
        }
        $scope.lstProd = [];
        $http.get('/Home/getAllImage', {
            params: { catID: catID, ProdID: ProdID, EndUser: EndUser, Style: Style, Color: Color, Wash: Wash }
        }).then(function (data) {
            $scope.lstProd = data.data.lstProduct;
            $scope.fill_Buyer = $scope.lstProd[0].BuyerName;
        }, function (error) {
            $.notify(error.data.message, { globalPosition: 'top right', type: 'error' });
        });
    }

    $scope.ProductFieldAccess = function (prodID) {
        //debugger;
        $scope.ProdCol = [];
        $http.get('/Home/ProductFieldAccess', { params: { ProductID: prodID, } }).then(function (data) {
            $scope.ProdCol = data.data.proDet;
            //alert($scope.ProdCol.EndUser);
            //alert($scope.ProdCol.StyleName);
            //alert($scope.ProdCol.ColorName);
            //alert($scope.ProdCol.WashName);
            //alert(angular.toJson($scope.ProdCol));
        }, function (error) {
            $.notify(error.data.message, { globalPosition: 'top right', type: 'error' });
        });
    }

    $scope.rotationImage = function (prodID) {
        //debugger;
        $scope.ProductFieldAccess(prodID);
        $scope.Prod = [];
        $http.get('/Home/getProductDetails', { params: { prodID: prodID, } }).then(function (data) {
            $scope.ProdDetails = data.data.ProductDetails;
        }, function (error) {
            $.notify(error.data.message, { globalPosition: 'top right', type: 'error' });
        });
    }

    $scope.GetAllBuyerWithAccess = function (ProductID, dateValue) {
        $scope.BuyerAccessList = [];
        $http.get('/User/GetAllBuyerWithAccess', { params: { ProductID: ProductID, validDate: dateValue } }).then(function (data) {
            $scope.BuyerAccessList = data.data.buyerList;
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: error.data.type });
        });
    }

    $scope.checkBoxBuyerLoad = function (ProductID, dateValue) {
        //debugger;
        $scope.sideBarReset();
        $scope.ShowBuyerPreviewModal();
        $scope.buyerAccessProduct = ProductID;
        $scope.GetAllBuyerWithAccess(ProductID, dateValue);
        //$scope.fill_ProductID(ProductID);
    }

    $scope.closeBuyerPreview = function () {
        $scope.buyerAccessProduct = null;
        $scope.HideBuyerPreviewModal();
    }

    $scope.BuyerImgAccess = function (chkBuyerAccess, ProductID, BuyerID, validity) {
        //debugger;
        $http({
            url: '/Home/BuyerPreviewAccess',
            method: 'POST',
            data: JSON.stringify({ chkBuyerAccess: chkBuyerAccess, ProductID: ProductID, BuyerID: BuyerID, validity: validity })
        }).then(function (data) {
            $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
        }, function (data) {
            $.notify('Error is ' + data.data.message, { globalPosition: 'top right', className: data.data.type });
        });
    }

    $scope.getAllProductDetails = function (ProductID) {
        //debugger;
        $scope.ProductURLList = [];
        $http.get('/Home/GetAllProductList', { params: { ProductID: ProductID } }).then(function (data) {
            $scope.ProductURLList = data.data.proDet;
            //alert(angular.toJson($scope.ProductURLList));
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: error.data.type });
        });
    }

    $scope.imageMove = function (imgLoad, txt) {
        //debugger;
        var index = 0;
        for (; index < $scope.ProductURLList.length; index++) {
            if ($scope.ProductURLList[index] == imgLoad) {
                break;
            }
        }

        if (txt == 'left') {
            if (index == 20)
                $scope.imgLoad = $scope.ProductURLList[0];
            else
                $scope.imgLoad = $scope.ProductURLList[index + 1];
        }
        if (txt == 'right') {
            if (index == 0)
                $scope.imgLoad = $scope.ProductURLList[20];
            else
                $scope.imgLoad = $scope.ProductURLList[index - 1];
        }
    }

    //----------------------------------------------------Product Filtering-------------------------------------------------------//
    //$scope.filCategoryChange = function (filCategory) {
    //    try {
    //        $.each($scope.categoryList, function (key, value) {
    //            if (filCategory == value.CategoryID) {
    //                $scope.lblCategoryID = filCategory;
    //                $scope.lblCategoryName = value.CategoryName;
    //                return;
    //            }
    //        });
    //    }
    //    catch (ex) {
    //        $.notify('CategoryChange' + ex.message);
    //    }

    //    if (filCategory == undefined) {
    //        $scope.lblCategoryID = '';
    //        $scope.lblCategoryName = '';
    //    }
    //}

    $scope.filterProduct = function () {

        try {
            $.each($scope.categoryList, function (key, value) {
                if ($scope.filCategory == value.CategoryID) {
                    $scope.lblCategoryID = $scope.filCategory;
                    $scope.lblCategoryName = value.CategoryName;
                    return;
                }
            });
        }
        catch (ex) {
            $.notify('CategoryChange' + ex.message);
        }

        if ($scope.filCategory == undefined) {
            $scope.lblCategoryID = '';
            $scope.lblCategoryName = '';
        }

        $scope.lblProductName = $scope.filProductName;
        $scope.lblEndUser = $scope.filEndUser;
        $scope.lblStyleName = $scope.filStyleName;
        $scope.lblColorName = $scope.filColorName;
        $scope.lblWashName = $scope.filWashName;
        $scope.getAllImage($scope.filCategory, $scope.filProductName, $scope.filEndUser, $scope.filStyleName, $scope.filColorName, $scope.filWashName);
    }
    //----------------------------------------------------Product Filtering-------------------------------------------------------//

    $scope.getProductField = function () {
        //debugger;
        $scope.ProductFieldList = [];
        $http.get('/User/GetAllProductFieldName').then(function (data) {
            $scope.ProductFieldList = data.data.productFieldNames;
            //alert(angular.toJson($scope.ProductFieldList));
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: error.data.type });
        });
    }

    $scope.getAllAccessData = function () {
        $scope.GetAllBuyer();
        $scope.GetAllCategory();
        $scope.getProductField();
        $scope.getAllUserIndex();
        $scope.UserBuyerAccessData();
    }

    $scope.chkBuyerProductAccessEntry = function () {
        if ($scope.BuyerID != undefined || $scope.BuyerID != null) {
            if ($scope.CategoryID != undefined || $scope.CategoryID != null) {
                return true;
            }
            else {
                $.notify('Select Buyer', { globalPosition: 'top right', className: 'warn' });
                return false;
            }
        }
        else {
            $.notify('Select Category', { globalPosition: 'top right', className: 'warn' });
            return false;
        }
    }

    $scope.BuyerProductAccessEntry = function (FieldID, bShow) {
        if ($scope.chkBuyerProductAccessEntry(bShow)) {
            $http({
                url: '/User/BuyerProductFieldAccess',
                method: 'POST',
                data: JSON.stringify({ BuyerID: $scope.BuyerID, CategoryID: $scope.CategoryID, FieldID: FieldID, bShow: bShow })
            }).then(function (data) {
                $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
            }, function (data) {
                $.notify('Error is ' + data.data.message, { globalPosition: 'top right', className: data.data.type });
            });
        }
    }

    $scope.CategoryChangeProductAccess = function (BuyerID, CategoryID) {
        //debugger;
        $scope.ProductFieldList = [];
        $http.get('/User/ProductFieldAccessData', { params: { BuyerID: BuyerID, CategoryID: CategoryID } }).then(function (data) {
            $scope.ProductFieldList = data.data.productFieldNames;
            //alert(angular.toJson($scope.ProductFieldList));
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: error.data.type });
        });
    }

    $scope.UserBuyerAccessData = function (UserID) {
        //debugger;
        $scope.UserBuyerAccessList = [];
        $http.get('/User/UserBuyerAccessData', { params: { UserID: UserID } }).then(function (data) {
            $scope.UserBuyerAccessList = data.data.userBuyerModels;
            //alert(angular.toJson($scope.ProductFieldList));
        }, function (error) {
            alert('Error is ' + error.message, { globalPosition: 'top right', className: error.data.type });
        });
    }

    $scope.chkUserWiseBuyerAccess = function (UserID) {
        if (UserID != undefined || UserID != null) {
            return true;
        }
        else {
            $.notify('Select Username', { globalPosition: 'top right', className: 'warn' });
            return false;
        }
    }

    $scope.UserWiseBuyerAccess = function (BuyerAccess, UserID, BuyerID) {
        if ($scope.chkUserWiseBuyerAccess(UserID)) {
            $http({
                url: '/User/UserWiseBuyerAccess',
                method: 'POST',
                data: JSON.stringify({ BuyerID: BuyerID, UserID: UserID, BuyerAccess: BuyerAccess })
            }).then(function (data) {
                $.notify(data.data.message, { globalPosition: 'top right', className: data.data.type });
            }, function (data) {
                $.notify('Error is ' + data.data.message, { globalPosition: 'top right', className: data.data.type });
            });
        }
    }
});
