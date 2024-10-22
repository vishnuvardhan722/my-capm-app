sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
], function (Controller, MessageToast, MessageBox, ODataModel, JSONModel) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function () {
            var oModel = this.getOwnerComponent().getModel(); // Get the model from the component
            this.getView().setModel(oModel);

            this.oEmpModel = new JSONModel();
            this.getView().setModel(this.oEmpModel, "EmpModel");
            this.getView().getModel("EmpModel").setProperty("/TableDetails", []);
            this.byId("rbg3").setSelectedIndex(-1);

            // testing 2

        },

        clearFields: function () {
            this.byId("bookTitleInput").setValue("");
            this.byId("authorInput").setValue("");
            this.byId("stockInput").setValue("");
            this.byId("Iname").setValue("");
            this.byId("Iage").setValue("");
            this.byId("IEmail").setValue("");
            this.byId("IPhoneNumber").setValue("");
            this.byId("IAddress").setValue("");
            this.byId("rbg3").setSelectedIndex(-1);
        },

        onCreate: function () {
            var ODataModel = this.getView().getModel();
            if (this.byId("bookTitleInput").getValue() === '' && this.byId("authorInput").getValue() === '') {
                MessageBox.show("Please fill all the details ..!", {
                    title: "Warning",
                    icon: MessageBox.Icon.WARNING
                });
            } else {
                var sTableData = this.getView().getModel("EmpModel").getProperty("/TableDetails");
                var newBook = {
                    ID: this.generateUUID(),
                    title: this.byId("bookTitleInput").getValue(),
                    author: this.byId("authorInput").getValue(),
                    stock: this.byId("stockInput").getValue(),
                    name: this.byId("Iname").getValue(),
                    age: this.byId("Iage").getValue(),
                    email: this.byId("IEmail").getValue(),
                    PhoneNumber: this.byId("IPhoneNumber").getValue(),
                    address: this.byId("IAddress").getValue(),
                    gender: this.byId("rbg3").getSelectedButton().getText(),
                    Projects: sTableData.map(project => ({
                        ID: this.generateUUID(),
                        Employee_ID: {
                            ID: this.generateUUID()
                        },
                        ProjectName: project.ProjectName,
                        ProjectLocation: project.ProjectLocation
                    }))
                };

                ODataModel.create("/Books", newBook, {
                    success: function () {
                        MessageBox.show("Book created successfully!");
                        this.clearFields();
                        this.getView().getModel("EmpModel").setProperty("/TableDetails", []);
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.show("Error creating book.");
                    }
                });
            }
        },

        // Method to generate a UUID (can use any UUID generation logic)
        generateUUID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        onDisplay: function () {
            var ODataModel = this.getView().getModel();
            ODataModel.read("/Books", {
                success: function (oData) {
                    var result = oData;
                    var oReadingModel = new sap.ui.model.json.JSONModel();
                    this.getView().setModel(oReadingModel, "ReadingModel");
                    this.getView().getModel("ReadingModel").setProperty("/BookDetails", result);
                    var len = oData.results.length;
                    console.log(len);
                    if (len === 0) {
                        MessageBox.warning("No Data in Backend");
                    }
                    //  else {
                    // //     MessageBox.show("Books Loaded successfully!");
                    // // }
                }.bind(this),
                error: function () {
                    MessageBox.show("Error Fetching book.");
                }
            })
        },

        onDelete: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel();
            var oTable = this.getView().byId("MyTable");
            var oBinding = oTable.getBinding("items");


            var oBindingContext = oEvent.getSource().getParent().getBindingContext("ReadingModel");
            var oSelectedBook = oBindingContext.getObject();
            var sDeletePath = "/Books(" + oSelectedBook.ID + ")";
            oModel.remove(sDeletePath, {
                success: function () {
                    MessageBox.success("Book deleted successfully!");
                    
                   
                }.bind(this),
                error: function (oError) {
                    console.error("Delete error:", oError);
                    MessageBox.error("Error deleting the book: " + oError.message);
                }
            });
        },

        onEdit: function (oEvent) {
            var rowPath = oEvent.getSource().getParent().getBindingContext("ReadingModel").sPath;
            var rowData = oEvent.getSource().getParent().getModel("ReadingModel").getProperty(rowPath);
            this.getView().getModel("ReadingModel").setProperty("/ReadTableData", rowData);
            var oView = this.getView();
            var oDialog = oView.byId("myDialog");

            if (oDialog) {
                oView.addDependent(oDialog);
            }
            oDialog.open();

        },
        onEditSave: function () {
            var oModel = this.getOwnerComponent().getModel();
            var Id = this.getView().byId("TID").getText();
            var updatename = this.getView().byId("Editname").getValue();
            var updateNumber = this.byId("EditPhoneNumber").getValue();
            var updateauthor = this.byId("Editauthor").getValue();
            var newBook = {
                ID: Id,
                name: updatename,
                PhoneNumber: updateNumber,
                author: updateauthor
            };
            var sPath = "/Books(" + newBook.ID + ")";
            oModel.update(sPath, newBook, {
                success: function () {
                    MessageBox.success("Book updated successfully!");
                    this.onEditClose();
                    this.onDisplay();
                }.bind(this),
                error: function () {
                    sap.m.MessageBox.error("Error updating the book.");
                }
            });
        },

        onEditClose: function () {
            var oDialog = this.getView().byId("myDialog");
            if (oDialog) {
                oDialog.close();
                oDialog = undefined;
            }
        },

        onPressInsert: function () {

            var sTableData = this.getView().getModel("EmpModel").getProperty("/TableDetails");

            var newSerialNo = sTableData.length + 1;

            var newRowData = {
                "Employee_ID": newSerialNo.toString(),
                "ProjectName": "",
                "ProjectLocation": ""
            };

            sTableData.push(newRowData);
            this.getView().getModel("EmpModel").refresh();
        },

        onPressDelete: function (oEvent) {
            var oBinding = this.byId("EmpTable").getBinding("rows");

            var sData = oBinding.oModel.getData().TableDetails;

            var oTable = this.byId("EmpTable");
            var oSelectedIndices = oTable.getSelectedIndices();

            for (var i = oSelectedIndices.length - 1; i >= 0; i--) {
                sData.splice(oSelectedIndices[i], 1);
                oBinding.getModel("EmpModel").refresh();
            }
            for (i = 0; i < sData.length; i++) {
                sData[i].Employee_ID = i + 1;
            }
            oBinding.getModel("EmpModel").refresh();
            oTable.clearSelection();
        }
    });
});
