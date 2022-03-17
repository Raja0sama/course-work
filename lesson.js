export default {
  props: [
    "subjects",
    "sortByPlaceHolder",
    "search",
    "orderByPlaceholder",
    "sortBy",
    "orderBy",
    "orderByPlaceholder",
    "isEnabled",
    "itemsInCart",
  ],
  template: `
      <main class="max-w-screen-xl py-20 text-gray-100 m-auto">
        <h1 class="text-xl ">
          Subjects 📕
        </h1>
        <p class="font-thin">
          Below are the subjects Available for extra classes, you can book a session by on:clicking on the link below
        </p>
        <div class="flex justify-between">
          <div class="">

            <select v-model="sortBy" class="bg-black w-40 p-2 border-2 mt-2 font-thin">
              <option value="" disabled selected>Sort By</option>

              <option v-for="item in sortByPlaceHolder" v-bind:value="item"> {{item}}</option>

            </select>
            <select v-model="orderBy" class="bg-black w-40 p-2 border-2 mt-2 font-thin">
              <option value="" disabled selected>Order By</option>
              <option v-for="item in orderByPlaceholder" v-bind:value="item">{{item}}</option>
            </select>

          </div>
          <div>
            <input type="text" v-model="search" class="bg-black w-60 p-2 border-2 mt-2 font-thin"
              placeholder="Search Now" />
          </div>

        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3  gap-4 mt-20">
          <div class="mx-10 border-2 border-gray-700 p-5 bg-gray-900" v-for="subject in subjects">
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
          </div>
        </div>
      </main>
  `,
  created() {},
  data: {},
  methods: {
    addToCart(id) {
      this.$emit("add-to-cart", id);
    },
  },
};

// itemsInCart;
// addToCart;
// isEnabled;
