import { PageLoader } from "@/components/page-loader"

export default function Loading() {
  return <PageLoader isLoading={true} message="Подготавливаем сессию с коучем..." />
}
