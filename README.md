# forum-app
Written in nodejs

## Requires

- Nodejs
- MongoDB

## Quick start
```
npm i
npn run start
```

## Docker
```
docker run -d -it --name forum-app fox0430/fourm-app
```

## Test
```
npm test
```

## API

### Create user

```
/create
```

Request

| Name | Type |
---|---|
| UserName | String |
| Password | String |

Example
```
{UserName: 'user', Password: "password"}
```

Responce

| Name | Type |
---|---
| Message | String |
| Token | String |

Example
```
{
    Message: 'Login success',
    Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWYyMmZkZDVlNThlNmUyYWZiZDc0MTk1IiwiaWF0IjoxNTk2MTI4NzI1LCJleHAiOjE1OTYyMTUxMjV9E4DcvxP9u4Vrnjzkw83jcoWVqFQ6YpC71snjauRn18Y'
}
```

### Login

```
/login
```

Request

| Name | Type |
---|---
| UserName | String |
| Password | String |

Example
```
{UserName: "user", Password: "password"}
```

Responce

Example
```
{
    Message: 'Login success',
    Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWYyMmZkZDVlNThlNmUyYWZiZDc0MTk1IiwiaWF0IjoxNTk2MTI4NzI1LCJleHAiOjE1OTYyMTUxMjV9E4DcvxP9u4Vrnjzkw83jcoWVqFQ6YpC71snjauRn18Y'
}
```

| Name | Type |
---|---
| Message | String |
| Token | String |

### Post content

```
/post
```

Request


! Need toke in headers

| Name | Type |
---|---|
| Message | String |

Example

```
{Message "test"}
```

Responce

| Name | Type |
---|---
| Message | String |

Example

```
{Message: "Success"}
```

### Get contents

```
/get
```

Responce

| Name | Type | Description |
---|---|---
| Contents | String | Array<Content> |

Constent

| Name | Type |
---|---
| UserID | String |
| Message | String |
| Timestamp | String |

Responce example
```
[{"UserID":"5f22fc430dec2427d9904474","Message":"test","Timestamp":"2020-07-30T16:58:43.180Z"}]
```