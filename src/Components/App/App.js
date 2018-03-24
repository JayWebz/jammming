import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: [],
			playlistName: 'New Playlist',
			playlistTracks: []
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}
	addTrack(trackToAdd) {
		let newID = trackToAdd.id;
		let currentTrack = this.state.playlistTracks.filter (track => track.id === newID);
		// Use the track's id property to check if the 
		// current song is in the playlistTracks state.
		if (currentTrack.length === 0) {
			let playlist = this.state.playlistTracks;
			 console.log('addTrack method- Track: ' + currentTrack);
			// If the id is new, add the song to the end of the playlist.
			playlist.push(trackToAdd);
			console.log('addTrack method- current playlist: ' + playlist);
			// Set the new state of the playlist
			this.setState({playlistTracks: playlist});
		}
	}
	removeTrack(trackToRemove) {
		// Uses the track's id property to
		// filter it out of playlistTracks
		let deleteID = trackToRemove.id;
		// Sets the new state of the playlist		
		this.setState({playlistTracks: this.state.playlistTracks.filter(
			track => track.id !== deleteID)
		});
	}
	updatePlaylistName(newPlaylistName) {
		// Sets the state of the playlist name
		// to the input argument
		this.setState({playlistName: newPlaylistName});
  }
	savePlaylist() {
		// Generates an array of uri values called trackURIs
		// from the playlistTracks property.  		
		const trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
		// Pass the track URIs array and playlistName to a method
		// that will save the user's playlist to their account.
		Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
			this.setState({
				playlistName: 'New Playlist',
				searchResults: [],
				playlistTracks: []
			});
		})
	}
	search(searchTerm) {
		Spotify.search(searchTerm).then(searchResults => {
			this.setState({searchResults: searchResults});
		});
	}
	render() {
		return (
			<div>
			  <h1>i<span className="highlight">Play</span>You<span className="highlight">Listen</span></h1>
			  <div className="App">
			    <SearchBar onSearch={this.search}/>
			    <div className="App-playlist">
			      <SearchResults 
			      	searchResults={this.state.searchResults} 
			      	onAdd={this.addTrack} />
			      <Playlist 
			      	playlistName={this.state.playlistName} 
			      	playlistTracks={this.state.playlistTracks} 
			      	onNameChange={this.updatePlaylistName} 
			      	onSave={this.savePlaylist} 
			      	onRemove={this.removeTrack} />
			    </div>
			  </div>
			</div>
		);
	}
}

export default App;