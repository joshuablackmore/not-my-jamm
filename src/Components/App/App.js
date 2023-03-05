import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import Playlist from '../Playlist/Playlist';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../Util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [], 
      playlistName: 'JB Drumming stuff',
      playlistTracks: [{album: "Stikki", artist: "Joshua Blackmore", id: "1H2tQv07I3LpFNejUko5Lb", name: "Stikki", uri: "spotify:track:1H2tQv07I3LpFNejUko5Lb"},
      {album: "Teeth For Teeth", artist: "Tiny Beast", id: "5hzCgbWRk1siBQIZxmJjI1", name: "Teeth For Teeth", uri: "spotify:track:5hzCgbWRk1siBQIZxmJjI1"},
      {album: "Brokespeak", artist: "Strobes", id: "4FYq2d3CYoMNEomgWujWBM", name: "Winder", uri: "spotify:track:4FYq2d3CYoMNEomgWujWBM"},
    {album: "Ninja Tune XX (Volume 2)", artist: "Floating Points Ensemble", id: "0UYW6Tgdq1GCCEMOSfzSFK", name: "Post Suite", uri: "spotify:track:0UYW6Tgdq1GCCEMOSfzSFK"}]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if(tracks.find(existingTracks => existingTracks.id === track.id)){
      return;
    } else {
      tracks.push(track);
      this.setState( {playlistTracks: tracks} );
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    const newTracks = tracks.filter(currentTracks => currentTracks.id !== track.id)
    this.setState({ playlistTracks: newTracks});
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }

  savePlaylist() {
   const trackURIs = this.state.playlistTracks.map(track => track.uri);
   Spotify.savePlaylist(this.state.playlistName,trackURIs).then(() =>{
    this.setState({
      playlistName: 'Make another playlist?',
      playlistTracks: []
    })
   })
   
  }

  search(term) {
    Spotify.search(term).then(searchItems => {
      this.setState( {searchResults: searchItems} )
    })
  }


  render() {
    return (
      <div>
        <h1>Not My <span className="highlight">Jamm</span></h1>
          <div className="App">

             <SearchBar onSearch={this.search} />
             <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
              <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
            </div>
          </div>
      </div>
    )
  }
}

export default App;
