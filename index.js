import Cart from "./cart.js";
import Checkout from "./checkout.js";
import Lessons from "./lesson.js";
let app;
app = new Vue({
  el: "#app",
  components: {
    lessons: {
      ...Lessons,
      created() {
        console.log({ s: this.$props });
      },
    },
    checkout: Checkout,
    cart: Cart,
  },

  data: {
    form: {
      name: "",
      nameError: "",
      phone: "",
      phoneError: "",
    },
    cartItems: [],
    orderBy: "",
    sortBy: "",

    search: "",
    currentPage: "home",
    sortByPlaceHolder: ["location", "price", "spaces", "rating", "title"],
    orderByPlaceholder: ["ascending", "descending"],
    subjects: [],
    originalData: [],
  },
  created: function () {
    fetch(
      "https://express-vue-app-raja.herokuapp.com/collection/webstore"
    ).then(function (response) {
      response.json().then(function (json) {
        console.log({ json });
        const d = json.map((e) => ({ ...e, id: e._id }));
        app.originalData = d;
        app.subjects = d;
      });
    });
  },
  methods: {
    // Create Order and Navigate to Success Page Page
    createAnOrder(pageToNavigate) {
      const a = this.cartItems.reduce((acc, curr) => {
        acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
        return acc;
      }, {});
      const order = {
        name: this.form.name,
        phone: this.form.phone,
        lessons: Object.entries(a).map(([k, v]) => ({
          lessonId: k,
          spaces: v,
        })),
      };
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      fetch("https://express-vue-app-raja.herokuapp.com/collection/order", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          ...order,
        }),
      })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      Object.entries(a).forEach(([k, v]) => {
        const { spaces } = app.subjects.find((e) => e._id === k);
        console.log({ spaces });
        fetch(
          `https://express-vue-app-raja.herokuapp.com/collection/webstore/${k}`,
          {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({
              spaces: spaces - v,
            }),
          }
        )
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      });
      this.navigate(pageToNavigate);
    },
    // Page Navigation Function
    navigate(id) {
      if (id && typeof id === "string") return (this.currentPage = id);

      const page = this.currentPage === "home" ? "cart" : "home";
      this.currentPage = page;
    },
    // Remove From Cart
    removeFromCart(id) {
      console.log({ id });
      const arr = this.cartItems;
      var index = arr.findIndex((e) => e === id);
      if (index > -1) {
        arr.splice(index, 1);
      }
      this.cartItems = arr;
    },

    getCartProducts() {
      const sub = this.subjects;
      const products = this.cartItems.reduce((acc, curr) => {
        if (acc[`id-${curr}`]) {
          acc[`id-${curr}`] = {
            ...acc[`id-${curr}`],
            inCart: acc[`id-${curr}`].inCart + 1,
          };
          return acc;
        }
        const find = sub.find((e) => e.id == curr);
        acc[`id-${curr}`] = {
          ...find,
          inCart: 1,
        };
        return acc;
      }, {});
      return Object.values(products);
    },
    addToCart(e) {
      const cart = app.cartItems;
      cart.push(e);
    },
    itemsInCart(id) {
      return this?.cartItems.filter((e) => e === id).length;
    },
    isEnabled(id) {
      const subject = this.subjects.find((e) => e.id === id);
      const getItemsInCart = this.itemsInCart(subject.id);
      console.log(subject.spaces > getItemsInCart);
      return subject.spaces > getItemsInCart;
    },
  },
  watch: {
    search(val) {
      // if (val === "") return (this.subjects = app.originalData);
      fetch(
        `https://express-vue-app-raja.herokuapp.com/collection/webstore?search=title:${val}`
      ).then(function (response) {
        response.json().then(function (json) {
          app.subjects = json.map((e) => ({ ...e, id: e._id }));
        });
      });

      // this.subjects = this.subjects.filter((e) =>
      //   e.title.toLowerCase().includes(val.toLowerCase())
      // );
    },
    orderBy(val) {
      const { subjects, sortBy } = this;
      const n = val === "ascending" ? -1 : 1;
      const p = val === "ascending" ? 1 : -1;
      const sub = subjects.sort(function (a, b) {
        if (a[sortBy] < b[sortBy]) {
          return n;
        }
        if (a[sortBy] > b[sortBy]) {
          return p;
        }
        return 0;
      });
      console.log({ subjects });

      this.subjects = sub;
    },

    sortBy(sortBy) {
      const { subjects, orderBy } = this;
      const n = orderBy === "ascending" ? -1 : 1;
      const p = orderBy === "ascending" ? 1 : -1;
      const sub = subjects.sort(function (a, b) {
        if (a[sortBy] < b[sortBy]) {
          return n;
        }
        if (a[sortBy] > b[sortBy]) {
          return p;
        }
        return 0;
      });
      console.log({ subjects });

      this.subjects = sub;
    },
  },
  computed: {
    isFormButtonValid() {
      // validate phone
      if (!this.form.name || !this.form.phone) {
        return false;
      }
      const reg = new RegExp("^[0-9]*$", "g");
      const reg1 = new RegExp("^[a-zA-Z_ ]*$", "g");
      const a = this.form.phone.match(reg);
      const b = this.form.name.match(reg1);
      if (!a || !b) {
        !b && (this.form.nameError = "Kindly make sure to only input string");
        !a && (this.form.phoneError = "Kindly make sure to only input Number");
        return false;
      }
      this.form.nameError = "";
      this.form.phoneError = "";

      return true;
    },
    pageInverse() {
      const page = this.currentPage === "home" ? "cart" : "home";
      return page;
    },
    totalCartSum() {
      return this.getCartProducts().reduce((acc, curr) => {
        acc += curr.price * curr.inCart;
        return acc;
      }, 0);
    },
    cartItemCount() {
      return this.cartItems.length;
    },
    isCartEnabled() {
      return this.cartItemCount.length > 0;
    },
  },
});
