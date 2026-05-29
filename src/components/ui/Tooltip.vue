<script setup lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider } from "radix-vue"
import { cn } from "~/utils"

interface Props {
  content: string
  side?: "top" | "bottom" | "left" | "right"
}

const props = withDefaults(defineProps<Props>(), {
  side: "top",
})
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent
        :side="props.side"
        :class="cn(
          'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        )"
      >
        {{ props.content }}
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>
