<script context="module" lang="ts">
  export enum Variant {
    Contained = "contained",
    Text = "text",
  }

  export enum Color {
    Primary = "primary",
    Secondary = "secondary",
  }
</script>

<script lang="ts">
  import clsx from "clsx";

  function createClasses(variant: Variant, color: Color) {
    if (color === Color.Primary)
      return [
        "ring-purple-500",
        {
          "bg-purple-500 text-white hover:bg-purple-600":
            variant === Variant.Contained,
          "text-purple-500 hover:bg-purple-600  hover:bg-opacity-10 dark:hover:bg-purple-300 dark:hover:bg-opacity-10":
            variant === Variant.Text,
        },
      ];
    return [
      "ring-gray-500",
      {
        "bg-gray-500 text-white hover:bg-gray-600":
          variant === Variant.Contained,
        "text-gray-800 dark:text-white hover:bg-gray-600 hover:bg-opacity-10 dark:hover:bg-gray-300 dark:hover:bg-opacity-10":
          variant === Variant.Text,
      },
    ];
  }
  export let color: Color = Color.Primary;
  export let variant: Variant = Variant.Contained;
</script>

<button
  class={clsx(
    "px-3 py-1 rounded focus:ring-2 ring-offset-1 focus:outline-none transition-colors font-bold",
    createClasses(variant, color)
  )}
  on:click
>
  <slot />
</button>
