let app;
app = new Vue({
  el: "#app",
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
    subjects: data,
  },
  methods: {
    navigate(id) {
      if (id && typeof id === "string") return (this.currentPage = id);
      const page = this.currentPage === "home" ? "cart" : "home";
      this.currentPage = page;
    },
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
      if (val === "") return (this.subjects = data);
      this.subjects = this.subjects.filter((e) =>
        e.title.toLowerCase().includes(val.toLowerCase())
      );
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
