let app;
app = new Vue({
  el: "#app",
  data: {
    form: {
      name: "",
      phone: "",
    },
    cartItems: [],
    orderBy: "Ascending",
    sortBy: "Title",
    search: "",
    currentPage: "checkout",
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
});
