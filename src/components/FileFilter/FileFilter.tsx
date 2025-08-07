import { useState } from 'react'
import Multiselect from 'multiselect-react-dropdown'
import "./FileFilter.css"

function FileFilter(props: { tags: string[], updateCallback: (filterFn: string, filterTags: string[]) => void}) {
	const [filterFn, setFilterFn] = useState<string>("")
	const [filterTags, setFilterTags] = useState<string[]>([])
	const [selectionLimit, setSelectionLimit] = useState<number>(-1)
	
	function updateFilterFn(fn: string): void {
		setFilterFn(fn)
		props.updateCallback(fn, filterTags)
	}

	function addFilterTag(tag: string): void {
		const ft = [...filterTags, tag]
		setFilterTags(ft)
		props.updateCallback(filterFn, ft)
		
		if (tag === "none") {
			setSelectionLimit(1)
		}
	}

	function removeFilterTag(tag: string): void {
		const ft = filterTags.filter((t) => t != tag)
		setFilterTags(ft)
		props.updateCallback(filterFn, ft)
		
		if (tag === "none") {
			setSelectionLimit(-1)
		}
	}
	
	return (
		<div className="maps-filter">
			<label htmlFor="name-input">Filter by Name </label>
			<input type="text" id="name-input" onChange={(e) => updateFilterFn(e.target.value)} />
			<label htmlFor="tag-dropdown">Filter by Tag(s) </label>
			<Multiselect id="tag-dropdown"
				isObject={false}
				options={props.tags}
				onSelect={(_selectedList, selectedItem: string) => addFilterTag(selectedItem)}
				onRemove={(_selectedList, removedItem: string) => removeFilterTag(removedItem)}
				selectionLimit={selectionLimit}
			/>
		</div>
	)
}

export default FileFilter