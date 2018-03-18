const SpotifyClientID = 'b935ce51f1bc421bb405d5fc7ae4e439';
const SpotifyRedirectURI = 'http://localhost:3000/';
let accessToken;

const Spotify = {
	getAccessToken() {
	// Check for current access token, new access token, or if no access token.	
		// Check if access token is already set
		if (accessToken) {
			return accessToken;
		}
		// If access token hasn't been set, 
		// check if access token was just obtained
		const accessTokenValue = window.location.href.match(/access_token=([^&]*)/);
		const expiresInValue = window.location.href.match(/expires_in=([^&]*)/);
		// If both values exist
		if (accessTokenValue && expiresInValue) {
			// Set access token and expiration time
			accessToken = accessTokenValue[1];
			let expiresIn = expiresInValue[1];
			// Set access token to expire at value for expiration time
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			// Clear URL parameters to prevent app from getting
			// expired access token
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			// if no access token, send user to following URL to get token
			window.location = `https://accounts.spotify.com/authorize?client_id=${SpotifyClientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${SpotifyRedirectURI}`;
		}
	},
	search(searchTerm) {
	// Will return a promise that will eventually resolve
	// to the list of tracks from the search
    const accessToken = Spotify.getAccessToken();
    // Start promise chain 
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      // Add Authorization header
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      // Map converted JSON to array of tracks
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
	},
	savePlaylist(playlistName, trackURIs) {
	// Write the custom playlist to Spotify account
		// Check if values exist for playlist name or tracks to save
		if(!playlistName || !trackURIs.length) {
			return;
		}
		// Set default variables for access token, headers, and userID
		const accessToken = Spotify.getAccessToken();
		
		console.log('accessToken: ' + accessToken);

		const headers = {Authorization: `Bearer ${accessToken}`};
		let userID = '';
		// Make request to return users Spotify username
		return fetch(`https://www.spotify.com/v1/me`, {
			headers: headers
		}).then(response => {
			return response.json();
		}, networkError => console.log("Cannot access User ID")
		).then(jsonResponse => {
			userID = jsonResponse.id;
			console.log(userID);
			// Use returned user ID to create new playlist for user
			return fetch(`https://www.spotify.com/v1/users/${userID}/playlists`, {
				headers: headers,
				method: 'POST',
				body: JSON.stringify({name: playlistName})
			}).then(response => {
				return response.json()
			}, networkError => console.log('Cannot create playlist')
			).then(jsonResponse => {
				let playlistID = jsonResponse.id;
				console.log("playlistID: " + playlistID);
				// Set the URIs parameter to an array of tracks passed in method
				return fetch(`https://www.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({uris: trackURIs})
				}).then(response => {
					return response.json()
				}, networkError => console.log('Cannot create tracks')
			);
			});
		});
	}
};

export default Spotify;