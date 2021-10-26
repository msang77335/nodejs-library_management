const express = require("express");
const auth = require("../middleware/auth.mdw");
const borrowReceiptModel = require("../models/borrow_receipt.model");
const readerModel = require("../models/reader.model");
const bookModel = require("../models/book.model");
const categoryModel = require("../models/category.model");
const validate = require("../middleware/validate.mdw");
const moment = require("moment");

const router = express.Router();

router.get("/", auth, async function (req, res) {
   const data = await borrowReceiptModel.find({ active: true });
   if (!data) {
      return res.status(200).json({ fetch: false, data: data });
   }
   const allReader = await readerModel.find();
   const borrowList = data.map((value) => {
      currentReader = allReader.find((reader) => reader.id === value.reader);
      return {
         id: value.id,
         reader: value.reader,
         borrowDate: value.borrowDate,
         books: value.books,
         paid: value.paid,
         createBy: value.createBy,
         avtive: value.active,
         reader: {
            key: currentReader.id,
            value: `${currentReader.id} - ${currentReader.name}`,
         },
      };
   });
   return res.status(200).json({ fetch: true, data: borrowList });
});

router.get("/:id", auth, async function (req, res) {
   const id = req.params.id || "0";
   const data = await borrowReceiptModel.findOne({ id: id, active: true });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: data,
         message: "Borrow receipt id invalid!",
      });
   }
   const borrow = {
      id: data.id,
      createBy: data.createBy,
      createDate: data.createDate,
      borrowDate: data.borrowDate,
      paid: data.paid,
      active: data.active,
   };
   Promise.all([
      readerModel.findOne({ id: data.reader }),
      bookModel.find(),
      categoryModel.find(),
   ])
      .then((values) => {
         borrow.reader = { key: values[0].id, value: values[0].name };
         const books = values[1].filter((book) => data.books.includes(book.id));
         const booksInfo = books.map((book) => {
            currentCategory = values[2].find(
               (value) => value.id === book.category
            );
            return {
               id: book.id,
               name: book.name,
               category: {
                  key: currentCategory.id,
                  value: currentCategory.name,
               },
               author: book.author,
               publisYear: book.publiYeaer,
               publisher: book.publisher,
               addDate: book.addDate,
               reciever: book.reciever,
               price: book.price,
               active: book.active,
            };
         });
         borrow.books = booksInfo;
         return res.status(200).json({ fetch: true, data: borrow });
      })
      .catch(() =>
         res.status(200).json({
            fetch: false,
            data: data,
            message: "Borrow Receipt id invalid!",
         })
      );
});

router.get("/:readerId/quantity-book", auth, async function (req, res) {
   const readerId = req.params.readerId || "0";
   const data = await borrowReceiptModel.find({
      reader: readerId,
      active: true,
      paid: false,
   });
   if (!data) {
      return res.status(200).json({
         fetch: false,
         data: { quantity: 0 },
         message: "Borrow receipt id invalid!",
      });
   }
   if (data.length === 0) {
      return res.status(200).json({ fetch: true, data: { quantity: 0 } });
   }
   const quantity = data.map((value) => value.books.length);
   const reducer = (previousValue, currentValue) =>
      previousValue + currentValue;
   const quantitySum = quantity.reduce(reducer);
   return res
      .status(200)
      .json({ fetch: true, data: { quantity: quantitySum } });
});

router.post("/", validate(borrowReceiptModel), async function (req, res) {
   const borrow = req.body;
   const lastBorrowReceipt = await borrowReceiptModel
      .find()
      .sort({ id: -1 })
      .limit(1);
   const lastId = lastBorrowReceipt[0].id.split(".")[1];
   const newId = "BR.".concat(
      (parseInt(lastId) + 1).toString().padStart(6, "0")
   );
   borrow.id = newId;
   borrow.createDate = moment().format("MM-DD-YYYY");
   borrow.active = true;
   borrow.paid = false;
   const result = await new borrowReceiptModel(borrow).save();
   res.status(201).json({ borrow: result, add: true });
});

router.patch("/:id", validate(borrowReceiptModel), async function (req, res) {
   const id = req.params.id || "0";
   const newBorrowReceipt = req.body;
   const borrowReceipt = await borrowReceiptModel.findOne({
      id: id,
      active: true,
   });
   if (!borrowReceipt) {
      return res
         .status(201)
         .json({ update: false, message: "Borrow Receipt invalid!" });
   }
   if (borrowReceipt.paid === true) {
      return res
         .status(201)
         .json({ update: false, message: "Can't Update Borrow receipt!" });
   }
   const lastBorrowReceipt = await borrowReceiptModel
      .find({ reader: borrowReceipt.reader })
      .sort({ id: -1 })
      .limit(1);
   if (id !== lastBorrowReceipt[0].id) {
      return res
         .status(201)
         .json({ update: false, message: "Can't Update Borrow receipt!" });
   }
   await borrowReceiptModel.updateOne({ id: id }, newBorrowReceipt);
   return res
      .status(201)
      .json({ update: true, message: "Update Borrow Receipt success!" });
});

router.delete("/:id", async function (req, res) {
   const id = req.params.id || "0";
   const borrowReceipt = await borrowReceiptModel.findOne({
      id: id,
      active: true,
   });
   if (borrowReceipt.paid === true) {
      return res
         .status(201)
         .json({ delete: false, message: "Can't Delete Borrow receipt!" });
   }
   if (!borrowReceipt) {
      return res.status(200).json({
         borrow: borrow,
         deleted: false,
         message: "Borrow receipt invalid!",
      });
   }
   const lastBorrowReceipt = await borrowReceiptModel
      .find({ reader: borrowReceipt.reader })
      .sort({ id: -1 })
      .limit(1);
   if (id !== lastBorrowReceipt[0].id) {
      return res
         .status(201)
         .json({ delete: false, message: "Can't Delete Borrow receipt!" });
   }
   await borrowReceiptModel.updateOne({ id: id }, { $set: { active: false } });
   //await borrow.remove();
   return res.status(200).json({
      delete: true,
      message: "Delete borrow receipt success!!!",
   });
});

module.exports = router;
