import { useState } from 'react'
import Multiselect from 'multiselect-react-dropdown'
import "./FileFilter.css"

function FileFilter(props: { tags: String[], updateCallback: Function}) {
	const [filterFn, setFilterFn] = useState<string>("")
	const [filterTags, setFilterTags] = useState<string[]>([])
	
	function updateFilterFn(fn: string): void {
		setFilterFn(fn)
		props.updateCallback(fn, filterTags)
	}

	function addFilterTag(tag: string): void {
		const ft = [...filterTags, tag]
		setFilterTags(ft)
		props.updateCallback(filterFn, ft)
	}

	function removeFilterTag(tag: string): void {
		const ft = filterTags.filter((t) => t != tag)
		setFilterTags(ft)
		props.updateCallback(filterFn, ft)
	}
	
	return (
		<div className="maps-filter">
			<label htmlFor="name-input">Filter by Name </label>
			<input type="text" id="name-input" onChange={(e) => updateFilterFn(e.target.value)} />
			<label htmlFor="tag-dropdown">Filter by Tag(s) </label>
			<Multiselect id="tag-dropdown"
				isObject={false}
				options={props.tags}
				onSelect={(selectedItem) => addFilterTag(selectedItem)}
				onRemove={(removedItem) => removeFilterTag(removedItem)}
			/>
		</div>
	)
}

export default FileFilter