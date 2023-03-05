const redirectURI = 'https://stunning-tulumba-80c729.netlify.app';
const clientID = 'd4dc65c352024b1faa11a8796f2f8fd6';
let expiresIn;
let accessToken;


const Spotify = {
    getAccessToken() {

        const url = window.location.href;
        const tokenMatch = url.match(/access_token=([^&]*)/);
        const expireMatch = url.match(/expires_in=([^&]*)/)

        if(accessToken){
            return accessToken;
        } else if (tokenMatch && expireMatch) {
                accessToken = tokenMatch[1];
                expiresIn = expireMatch[1];
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken
            } else {
                const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
                window.location = accessURL;
            }  
    },

    search(term) {
        this.getAccessToken(); 
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => {
          if(response.ok) {
            return response.json();
          }
          throw new Error('Request Failed');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          if (jsonResponse.tracks) {
            return jsonResponse.tracks.items.map(track => ({
              id: track.id,
              title: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            })
          );
          } else {
            return [];
          }
        });
      },


   
    savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) {
            return; 
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`}
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST', 
                body: JSON.stringify({ name: name })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST', 
                    body: JSON.stringify({ uris: trackUris })
                })
            })
        })

       
    }

}




export default Spotify