import { ref, computed } from "vue"
import { vi } from "vitest"

vi.stubGlobal("ref", ref)
vi.stubGlobal("computed", computed)
