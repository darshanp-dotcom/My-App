export type InventoryCategory =
  | "Sweeteners"
  | "Coffee & Espresso"
  | "Dairy & Alternatives"
  | "Flavors & Toppings"
  | "Tea & Refreshers"
  | "Food"
  | "Packaging"
  | "Beverages"
  | "Supplies";

export type InventoryItem = {
  name: string;
  category: InventoryCategory;
};

export const inventoryCategories: InventoryCategory[] = [
  "Sweeteners",
  "Coffee & Espresso",
  "Dairy & Alternatives",
  "Flavors & Toppings",
  "Tea & Refreshers",
  "Food",
  "Packaging",
  "Beverages",
  "Supplies",
];

export const inventoryItems: InventoryItem[] = [
  { name: "InvLiquid Sugar in Square Bottles 6-64oz", category: "Sweeteners" },
  { name: "BULK Splenda 12 Pounds", category: "Sweeteners" },
  { name: "Extrafine Coffee Sugar 50 pound bag", category: "Sweeteners" },
  { name: "Sweetener Equal 2000 per case", category: "Sweeteners" },
  { name: "Sweetener Stevia 1000 per case", category: "Sweeteners" },
  { name: "Pump Cane Sugar 12ML Blue 48pk SW", category: "Sweeteners" },

  { name: "Coffee 6/5 Whole Bean 30 pounds", category: "Coffee & Espresso" },
  { name: "Cold Brew Coffee 12/15 Ounce", category: "Coffee & Espresso" },
  { name: "Espresso Whole Bean 8/2 pound", category: "Coffee & Espresso" },
  {
    name: "Espresso Whole Bean Decaf 8/1 pound",
    category: "Coffee & Espresso",
  },
  { name: "Iced Coffee OB 20/14oz", category: "Coffee & Espresso" },
  { name: "Decaf Original Blend Iced Coffee", category: "Coffee & Espresso" },
  {
    name: "Coffee Decaf 6/5 Whole Bean 30 pounds",
    category: "Coffee & Espresso",
  },
  { name: "K Cup Coffee Original 6/12", category: "Coffee & Espresso" },

  { name: "Almond Breeze 12/32 ounce", category: "Dairy & Alternatives" },
  { name: "Coffee Milk 6/64 Ounce", category: "Dairy & Alternatives" },
  {
    name: "Extra Creamy Oat Milk 6/52 ounce",
    category: "Dairy & Alternatives",
  },
  {
    name: "Light Cream Half Gallons 9 per case",
    category: "Dairy & Alternatives",
  },
  {
    name: "Mini Creamers 3/8 ounce 400 per case",
    category: "Dairy & Alternatives",
  },
  { name: "Skim Milk Gallons 4 per case", category: "Dairy & Alternatives" },
  {
    name: "Topping Dunkin Sweet Cold Foam 12/15oz",
    category: "Flavors & Toppings",
  },
  { name: "Whole Milk Gallons 4 per case", category: "Dairy & Alternatives" },
  {
    name: "Classic Light Whipped Cream 12 pack",
    category: "Flavors & Toppings",
  },
  {
    name: "Topping Banana Cold Foam 12/15oz",
    category: "Flavors & Toppings",
  },
  {
    name: "Milk Lactaid Protein 6/52 ounce",
    category: "Dairy & Alternatives",
  },
  {
    name: "Flavor Shot Hazelnut 1 Liter Bottle",
    category: "Flavors & Toppings",
  },
  { name: "Flavor Shot Vanilla 1 Liter", category: "Flavors & Toppings" },
  {
    name: "Swirl Butter Pecan 4/64 ounce bottles",
    category: "Flavors & Toppings",
  },
  {
    name: "Swirl Caramel 6/64 ounce bottles",
    category: "Flavors & Toppings",
  },
  {
    name: "Swirl French Vanilla 4/64 ounce bottles",
    category: "Flavors & Toppings",
  },
  {
    name: "Syrup Brown Sugar 4/64 ounce bottles",
    category: "Flavors & Toppings",
  },
  { name: "Swirl Mocha 6/64 ounce bottles", category: "Flavors & Toppings" },

  { name: "Bulk Black Tea 750 Count", category: "Tea & Refreshers" },
  { name: "Chai Tea Concentrate 6/30 ounce", category: "Tea & Refreshers" },
  {
    name: "Lemonade Concentrate 12/32 Ounce",
    category: "Tea & Refreshers",
  },
  {
    name: "Mango Pineapple Refresher 12/46 ounce",
    category: "Tea & Refreshers",
  },
  {
    name: "Strawberry Dragonfruit Dunkin Refresher",
    category: "Tea & Refreshers",
  },
  { name: "Berry Acai Refresher 12/46oz", category: "Tea & Refreshers" },
  {
    name: "Hot Chocolate Original 8/3 pound bags",
    category: "Tea & Refreshers",
  },

  { name: "Croissant New FTO All Butter 120/3oz", category: "Food" },
  { name: "Egg Fried MF 228 per case", category: "Food" },
  { name: "Hashbrown Reduced Sodium 6/3 lb", category: "Food" },
  {
    name: "Tortilla Flour 5.5 Inch RES 576 per case",
    category: "Food",
  },
  { name: "Croissant Ham and Cheese 42 count", category: "Food" },
  { name: "Bacon Cherrywood 4/150", category: "Food" },
  { name: "Pork Sausage Patty 106 per case", category: "Food" },
  { name: "Turkey Sausage Patty 106 per case", category: "Food" },
  { name: "Cheese American 4 per case", category: "Food" },
  {
    name: "Cheese White Cheddar 3 month aged 6/24oz",
    category: "Food",
  },
  { name: "Butter with Canola Oil 6/24 ounce", category: "Food" },
  { name: "English Muffin 72 per case", category: "Food" },
  { name: "Filled Bagel Round Everything 120/case", category: "Food" },
  { name: "FTO Cinn Rais Bagel Dough 104/4.5oz", category: "Food" },
  {
    name: "FTO Multigrain Bagel 104/4.5 ounce",
    category: "Food",
  },
  { name: "FTO Plain Bagel Dough 104/4.5 ounce", category: "Food" },
  { name: "Filled Bagel Round Plain 120 per case", category: "Food" },
  { name: "Cream Cheese 3# RE Plain 6 Tubs", category: "Food" },
  { name: "Cream Cheese Plain RE 1.5/48", category: "Food" },
  { name: "Cream cheese 8 ounce RE Plain 12", category: "Food" },
  { name: "Spread Avocado 50/1.75 ounce", category: "Food" },
  { name: "Sweet Black Pepper Rub 10/3 ounce", category: "Food" },

  { name: "Hot Cup 14 ounce Evergreen 600 per case", category: "Packaging" },
  { name: "Hot Cup 18 ounce Evergreen 480 per case", category: "Packaging" },
  { name: "Hot Cup 22 ounce Evergreen 400 per case", category: "Packaging" },
  {
    name: "Lid Poly for DW Hot Cups 1200/case NG",
    category: "Packaging",
  },
  { name: "Hot Cup 12 ounce Evergreen 600 per case", category: "Packaging" },
  {
    name: "Cold Cup Dunkin Zero 24 ounce 600 case (sub for 915263)",
    category: "Packaging",
  },
  {
    name: "Cold Cup Dunkin Zero 32 ounce 500 case (sub for 915264)",
    category: "Packaging",
  },
  {
    name: "Cold Cup Flat Lid 16/24 ounce 1000 count",
    category: "Packaging",
  },
  { name: "Interfolded Napkin", category: "Packaging" },
  { name: "Straw 10.25 Inch Orange/Pink Large 1200", category: "Packaging" },
  {
    name: "Straw 8.25 Inch Orange/Pink Small 10,000",
    category: "Packaging",
  },
  { name: "Breakfast Bowl Lid 500 per case", category: "Packaging" },
  {
    name: "Carrier 4 Cup 300 per case (sub for 913959)",
    category: "Packaging",
  },
  { name: "Munchkin Box 10 count No Window", category: "Packaging" },
  { name: "Donut Box 6ct Gap Print 180 per case", category: "Packaging" },
  { name: "Baled Bagel Bag 4 pound 1000 per case", category: "Packaging" },
  { name: "Hash Brown Sleeve New 1000 per case", category: "Packaging" },

  { name: "Deer Park Water 24/20 Ounce Bottles/CS", category: "Beverages" },
  { name: "Milk Chug Whole 12/14 ounce", category: "Beverages" },
  { name: "Pepsi Regular 24/20 ounce", category: "Beverages" },
  { name: "Tropicana Orange Juice 11oz 24pk", category: "Beverages" },
  { name: "Poland Springs Sparkling Water 24/16.9oz", category: "Beverages" },
  { name: "Tropicana Apple Juice 24/10 ounce", category: "Beverages" },

  { name: "Toilet Tissue Jumbo 12 per case", category: "Supplies" },
  { name: "HDPE Trash Bags 30-40 Gal Black 250 ct", category: "Supplies" },
  { name: "HDPE Trash Bags 40-45 Gal 200 per case", category: "Supplies" },
  { name: "Gloves Vinyl PowderFree XL 10/100", category: "Supplies" },
  { name: "JB Chocolate Cake Munchkin 440 per case", category: "Food" },
  { name: "JB Yeast Munchkin 350 per case", category: "Food" },
  { name: "JB Yeast Ring 120 per case", category: "Food" },
];

