import React from 'react';

 

export default class MusicComponent extends React.Component {

    

 

    constructor(props) {

        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: {
              data: [],
              isLoaded: false,
              error: null
          },
          albums:{
            data: [],
            isLoaded: false,
            error: null
          }

        };
        this.artistdata = this.state.items.data;
        this.artistdataLoaded = false;
        this.getArtistNames = this.getArtistNames.bind(this);
        this.getAlbuma = this.getAlbuma.bind(this);

      }

    getArtistNames() {
        
        fetch("https://itunes.apple.com/search?term="+this.searchString+"&entity=musicArtist")
          .then(res => res.json())
          .then(
            (result) => {
              if(result.resultCount === 1){
                this.artistName = result.results[0].artistName;
                this.artistdataLoaded = false;
                this.getAlbuma();
                
              }  
              else{
              this.artistdata = result.results;
              this.artistdataLoaded = false;
              this.setState({
                error: null,
                isLoaded: true,
                items: {
                    data: result.results,
                    isLoaded: true,
                    error: null
                },
                albums:{
                  data: [],
                  isLoaded: false,
                  error: null
                }
            

                });
              }

            },
            (error) => {
              this.setState({
                isLoaded: true,
                error : 'access Issues'
              });
            }

          )

    }

    

 

    getAlbuma() {
        
        fetch("https://itunes.apple.com/search?term="+this.artistName+"&entity=album")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                error: null,
                isLoaded: true,
                items: {
                    data: this.artistdata,
                    isLoaded: this.artistdataLoaded,
                    error: null
                },
                albums:{
                  data: result.results,
                  isLoaded: true,
                  error: null
                }
           });
        },

            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
    }



    renderAlbums(){
       
        if(this.state.albums.isLoaded){
           return (<div>
               {this.state.albums.data.map((obj) => {
                return   (<div className="album"> 
                            <img src ={this.imageUrl(obj.artworkUrl100)} width="100%" /> 
                            <p>{obj.collectionName}</p>
                            <p><strong> by </strong></p>
                            <p>{obj.artistName}</p>
                            <p><strong> Year </strong>{obj.releaseDate.substring(0,4)}</p>
                            </div>)
                })}
            <div className="clear"></div></div> )
        } else{
            return (<div></div>)
        }
    }


    renderArtistName(){

        if(this.state.items.isLoaded){
           return (<div className="search"> <span className="center">select your favorite  of Artist</span>
                <select className="formElements" onChange={(evt) => { this.artistName = evt.target.value; }}>
               <option value="">Select one</option>
               {this.state.items.data.map((obj) => {
                   return   <option value={obj.artistName}> {obj.artistName}</option>
            })}
           </select> <a href="#" className="button"  onClick={this.getAlbuma}>Get Albums</a> </div> )
        } else{
        return (<div></div>)
        }
    }

    imageUrl(URL){
        let index= URL.lastIndexOf('100x100bb.jpg');
        if(index > 0)
        {
        return URL.substring(0,index) +"500x500bb.jpg";
        }
        else{
            return URL;
        }
    }
 

      render() {

       return( <div className="app">
            <div className="search">
                <p>Search your favorite Artist albums</p>
                <span className="center">Enter Artist Name</span>
            <input className="formElements" type="text" onChange={(evt) => { this.searchString = evt.target.value; }}/>
                <a  href="#" className="button"  onClick={this.getArtistNames}>Search</a>
            </div>
            {this.renderArtistName()}
            <br/>
            <br/>
            {this.renderAlbums()}
            </div>
       );
      }
    }