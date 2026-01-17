const Venues = () => {
	return (
		<section className="grid sm:grid-cols-[auto_1fr] gap-4 h-full">
			<div className="bg-blue-100 p-4 w-60 h-full 2xs:hidden md:block">
				<div>
					<h5 className="font-bold mb-4">Search</h5>
					<input 							className=" bg-content-bg text-fg p-2 w-full"
 type="text" />
				</div>
				<div>
					<h5 className="font-bold mb-4">Filter</h5>
				</div>
			</div>
			<div>
				<div className="bg-gray-100">Content</div>
			</div>
		</section>
	)
}

export default Venues
