<script setup lang="ts">
import { ref } from "vue"
import { Upload, X, Link, Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import { uploadService } from "~/services/upload.service"
import { useIsDemo } from "~/composables/useIsDemo"
import { useToast } from "~/composables/useToast"

interface Props {
  value?: string
  error?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [url: string]
}>()

const { t } = useI18n()
const isDemo = useIsDemo()
const toast = useToast()
// Demo account is read-only server-side: lock the control and explain,
// instead of letting the click fail with a bare 403.
const locked = computed(() => props.disabled || isDemo.value)
const urlInput = ref("")
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

async function handleFile(file: File) {
  uploading.value = true
  try {
    const url = await uploadService.upload(file)
    emit("change", url)
  } catch (err) {
    console.error("Upload failed", err)
    const data = (err as { response?: { data?: { message?: string; meta?: { errors?: Record<string, string[]> } } } })?.response?.data
    const serverMessage = data?.meta?.errors ? Object.values(data.meta.errors).flat()[0] : undefined
    toast.error(t("errors.uploadFailed"), serverMessage || data?.message || t("api.serverError"))
  } finally {
    uploading.value = false
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith("image/")) handleFile(file)
}

const URL_PROTOCOL_RE = /^(https?:\/\/|data:)/i

function isValidImageUrl(url: string): boolean {
  return URL_PROTOCOL_RE.test(url)
}

function handleUrlSubmit() {
  const val = urlInput.value.trim()
  if (val) {
    if (!isValidImageUrl(val)) return
    emit("change", val)
    urlInput.value = ""
  }
}

function handleRemove() {
  emit("change", "")
}
</script>

<template>
  <div class="space-y-2">
    <div
      @drop="handleDrop"
      @dragover.prevent
      :class="[
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
        props.value ? 'border-transparent' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        locked && 'opacity-50 cursor-not-allowed',
      ]"
    >
      <div v-if="props.value" class="relative w-full">
        <img :src="props.value" :alt="t('a11y.preview')" class="mx-auto max-h-48 rounded-md object-contain" />
        <Button
          v-if="!locked"
          type="button"
          variant="destructive"
          size="icon"
          class="absolute -right-2 -top-2 h-6 w-6 rounded-full"
          @click="handleRemove"
        >
          <X class="h-3 w-3" />
        </Button>
      </div>
      <template v-else-if="uploading">
        <Loader2 class="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
        <p class="text-sm text-muted-foreground">{{ t('common.loading') }}</p>
      </template>
      <template v-else>
        <Upload class="mb-2 h-8 w-8 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">{{ t('imageUpload.dragDrop') }}</p>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          :disabled="locked || uploading"
          @change="($event.target as HTMLInputElement).files?.[0] && handleFile(($event.target as HTMLInputElement).files![0])"
        />
        <Button type="button" variant="outline" size="sm" class="mt-2" :disabled="locked || uploading" @click="fileInputRef?.click()">
          {{ t('imageUpload.browse') }}
        </Button>
      </template>
    </div>
    <div v-if="!props.value" class="flex gap-2">
      <Input v-model="urlInput" :placeholder="t('imageUpload.pasteUrl')" :disabled="locked" />
      <Button type="button" variant="outline" size="sm" :disabled="locked || !urlInput" @click="handleUrlSubmit">
        <Link class="h-3 w-3 mr-1" /> {{ t('imageUpload.set') }}
      </Button>
    </div>
    <p v-if="props.error" class="text-sm text-destructive">{{ props.error }}</p>
    <p v-if="isDemo && !props.disabled" class="text-xs text-muted-foreground">{{ t('common.demoReadOnly') }}</p>
  </div>
</template>
