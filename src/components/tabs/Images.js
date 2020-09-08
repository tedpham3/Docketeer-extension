import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import * as helper from "../helper/commands"
const Images = (props) => {

	const dispatch = useDispatch();

	const addRunningContainers = (data) => dispatch(actions.addRunningContainers(data));

	const imagesList = useSelector((state) => state.lists.imagesList);
	const runningList = useSelector((state) => state.lists.runningList);
	// const addAdditionalImageContainer = (id) => dispatch(actions.runImages(id))
	const renderImagesList = imagesList.map(ele => {
		//      let objArray = ['resp', 'tag', 'imgid', 'created', 'size'] 

		return (
			<div className="box">
			<div className="images-header">
				<header><i class="fas fa-chalkboard"></i> IMAGES</header>
			</div>
			<div className="stopped-info">
				<li>Repository : {ele['reps']}</li>
				<li>Image ID : {ele['imgid']}</li>
				<li>Size : {ele['size']}</li>
				<li>Tag : {ele['tag']}</li>
				</div>
				<div className="stopped-button">
				<button onClick={() => props.runIm(ele['imgid'], runningList, helper.addRunning, addRunningContainers)}>Add Container based on Image</button>
				</div>
			</div>
		)
	});

	return (
		<div>
			<div className="renderContainers">
				{renderImagesList}
			</div>
		</div>
	)
}

export default Images;