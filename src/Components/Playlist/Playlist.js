import React from 'react';
import './Playlist.css';
import Tracklist from '../Tracklist/Tracklist';

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.handleNameChange = this.handleNameChange.bind(this);
	}
	handleNameChange(event) {
		this.props.onNameChange(event.target.value);
	}
	render() {
		return (
			<div className="Playlist">
  				<input defaultValue={'New Playlist Name'} value={this.playlistName} onChange={this.handleNameChange}/>
  				<Tracklist tracks={this.props.playlistTracks} onRemove={this.onRemove}/>
  				<a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
			</div>
		);
	}
}

export default Playlist;