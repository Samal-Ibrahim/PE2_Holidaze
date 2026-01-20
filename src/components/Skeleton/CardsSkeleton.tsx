const CardsSkeleton = () => {
	return (
		<section className="flex flex-col gap-4 h-full">
			<input type="text" className="skeleton w-full h-10 rounded" />
			<div className="grid lg:grid-cols-[auto_1fr] gap-4 h-full">
				<div className="  w-60 h-full 2xs:hidden lg:block">
					<div
						className="h-full bg-gray-50
					 p-2 shadow"
					>
						<div className="skeleton w-full h-6"></div>
					</div>
				</div>
				<div className="h-full">
					<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 ">
						{Array.from({ length: 12 }).map((_, index) => (
							<div
								className="card"
								key={`skeleton-card-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <static skeleton>
									index
								}`}
							>
								<div className=" shrink-0 w-full h-48 overflow-hidden">
									<div className="skeleton w-full h-full"></div>
								</div>
								<div className="flex flex-col gap-2 w-full h-full ">
									<div className="flex flex-row justify-between">
										<div className="w-50">
											<div className="skeleton w-full h-6"></div>
										</div>
										<div className="skeleton w-15 h-6"></div>
									</div>
									<div>
										<p className="skeleton w-full h-4 rounded">&nbsp;</p>
									</div>
									<div className="flex flex-row justify-between">
										<div className="skeleton w-15 h-6"></div>
										<div className="flex items-center gap-1">
											<div className="skeleton w-15 h-6"></div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default CardsSkeleton
