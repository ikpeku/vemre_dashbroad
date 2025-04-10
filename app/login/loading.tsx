
import { Progress } from "@/components/ui/progress"

export default function Loading() {
  return (
	<section className="w-screen h-screen flex justify-center items-center">
		<div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">

		<Progress  />
		</div>

	
</section>

  )
}

