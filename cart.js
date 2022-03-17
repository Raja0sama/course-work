export default {
  props: [
    "form",
    "getCartProducts",
    "isFormButtonValid",
    "cartItemCount",
    "navigate",
    "itemsInCart",
    "isEnabled",
  ],
  template: `
  <main class="max-w-screen-xl py-20 text-gray-100 m-auto">
        <h1 class="text-xl ">
          Cart📕
        </h1>
        <p class="font-thin">
          Below are the products that you have added in the cart, you can remove them if you want or checkout from the
          form below
        </p>

        <button v-on:click="()=> navigate('checkout')"
          class=" border-2 text-sm p-2 font-extralight mt-5 w-full text-center hover:bg-black hover:text-white cursor-pointer bg-white text-black">
          Proceed with Checkout {{cartItemCount == 0 ? "(disabled)" : ""}}
        </button>


        <div class="grid grid-cols-3 gap-4 mt-20">
          <div class="mx-10 border-2 border-gray-700 p-5 bg-gray-900" v-for="subject in getCartProducts">
            <img v-bind:src="subject.image" class="w-full h-80	" style="object-fit:cover" />
            <div class="flex justify-between pt-2">
              <div>
                <h1 class="text-xl">
                  {{subject.title}}
                </h1>
                <p class="font-thin">
                  Class Location : {{subject.location}} <br />
                  Spaces Available : {{subject.spaces - itemsInCart(subject.id)}}<br />
                  <span v-for="i in 5">
                    {{i <= subject.rating ? "★" : "☆" }} </span>
                </p>
              </div>
              <span>
                {{subject.price}}$
              </span>
            </div>

            <button v-on:click='()=> addToCart(subject.id)' v-bind:disabled="!isEnabled(subject.id)"
              class="border-2 text-sm p-2 font-extralight mt-5 w-full text-center hover:bg-black cursor-pointer">
              Add to Cart {{!isEnabled(subject.id) ? "(disabled)" : ""}}
            </button>
            <button v-on:click='()=> removeFromCart(subject.id)'
              class="border-2 text-sm p-2 font-extralight mt-5 w-full text-center hover:bg-black cursor-pointer">
              Remove from Cart ({{subject.inCart}})
            </button>
          </div>
        </div>
      </main>
  `,
  methods: {
    addToCart(e) {
      this.$emit("add-to-cart", e);
    },
    removeFromCart(e) {
      this.$emit("remove-from-cart", e);
    },
  },
  created() {
    console.log({ props: this.$props });
  },
  data() {
    return {};
  },
};
