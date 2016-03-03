# pictawall API documentation.
### Events

`GET /events/{eventId}`

*Response:*  

```
{
  data: {
    id: # (integer) event numeric id.
    name: (string) event name.
    identifier: # (string) event string id.
    ratio: # (integer) number of assets to display between each ads.
    showTopUsers: # (boolean) TODO unknown
  }
}
```

### Event Assets

#### List all
`GET /events/{eventId}/assets`  
Retrieves the list of assets linked to an event

*Response:*  

```
{
  since: # (integer) timestamp at which the request was made.
  total: # (integer) Count of how many assets are available in the server.
  pageCount: # (integer) How many pages of assets are available for download.
  page: # (integer) The number of the page returned by this request.
  data: # (AssetModel[]) list of event assets.
}
```

`GET /events/{eventId}/assets/{assetId}`  
Retrieves a specific asset.

*Response:*  

```
{
  data: # (EventModel) the requested asset object.
}
```

- An invalid event ID will result in an error 404.
- An invalid asset ID will result in an error 400.

#### Asset object format:

```
{
    id: # (int) pictawall asset ID,
    event: # (string) owning event identifier,
    source: {
        type: # (string) source type, eg 'twitter',
        id: # (string) identifier used by the source,
        additionalData: {
            # Data specific to a given source, eg. retweet count for assets fetched from twitter.
        }
    },
    kind: # (string) type of asset (eg 'video', 'picture', 'text'),
    media: {
        thumbnail: # (string) url to a thumbnail of the image,
        default: # (string) url to the regular version of the image, what was previously returned by 'url'
        small: (string) # url to a small version of the image,
        medium: # similar to above
        large: # similar to above
        ...
        
        # if one is not available, set to null
        # scripts used to retrieve other versions are avaialble in the pictahub engine source code.
        # note: remember to switch twitter images from http to https
    },
    postTime: # (int) timestamp at which the image was posted.
    link: # (string) url pointing to the original source.
    message: # (string) message associated with the asset. If none is available, please return an empty string.
    likeCount: # (int) asset like count.
    commentCount: # (int) asset comment count.

    owner: {
        author: # (string) Author display name.
        username: # (string) Author account name.
        avatar: # (string) url pointing to the user's avatar.
    }

    displayCount: # (int) Total of times the asset was displayed,
    favorited: # (boolean) The asset was favorited by the content manager,
    featured: # (boolean) The asset is featured by the content manager,
    safe: # (boolean) false: The asset is unsafe and the display should add a report option, true: the asset is safe for display.
}
```

### Event Ads

#### List all
`GET /events/{eventId}/ads`  
Retrieves the list of ads linked to an event

*Response:*

```
{
  data: # (AdModel[]) list of event ads.
}
```

`GET /events/{eventId}/ads/{adId}`  
Retrieves a specific ad.

*Response:*

```
{
  data: # (AdModel) the requested ad object.
}
```

#### Ad object format:

```
{
  id: # (integer) ad numeric identifier.
  message: # (string) message associated with the ad. If none is available, please return an empty string.
  kind: # (string) type of asset (currently only 'picture' is supported),
  media: {
    default: # url pointing to the default ad image.
  }
  link: # (string) URL pointing to the sponsoring content.
  displayOrder: # (optionnal) TODO unknown
  embed: # (boolean) TODO unknown
}
```

### Event messages

#### List all
`GET /events/{eventId}/messages`  
Retrieves the list of messages linked to an event

*Response:*

```
{
  data: # (MessageModel[]) list of messages.
}
```

`GET /events/{eventId}/messages/{messageId}`  
Retrieves a specific message.

*Response:*

```
{
  data: # (MessageModel) the requested message object.
}
```

#### Message object format:

```
{
  id: # (integer) message numeric id.
  title: # (string) message title.
  url: # (string|null) TODO unknown
  content: # (string) message body.
  duration: # (number) how long in seconds should the message be displayed.
  position: # (number) TODO unknown
  play: # (boolean) the message may be displayed.
  startTime: # (number) timestamp determining the begining of the period during which the message may be displayed.
  endTime: # (number) timestamp determining the end of the period during which the message may be displayed.
}
```
