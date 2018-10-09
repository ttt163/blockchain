/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root route
 */

import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Cookie from 'js-cookie'

const isLogined = (nextState, replace) => {
    if (!Cookie.get('hx_user_id')) {
        replace('/')
    }
}

const rootRoutes = <div>
    <Route path="/" getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Main').default)
        }, 'Main')
    }}>
        <IndexRoute getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Index').default)
            }, 'Index')
        }}/>
        <Route path='/index' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Index').default)
            }, 'Index')
        }}/>
        <Route path='/personal' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Personal').default)
            }, 'Personal')
        }}/>
        <Route path='/livenews' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/FlashNews').default)
            }, 'FlashNews')
        }}/>
        <Route path='/markets' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Market').default)
            }, 'Market')
        }}/>
        <Route path='/news' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/News').default)
            }, 'News')
        }}/>
        <Route path='/newsauthor' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/NewsAuthor').default)
            }, 'NewsAuthor')
        }}/>
        <Route path='/primer' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/NewsPrimer').default)
            }, 'NewsPrimer')
        }}/>
        <Route path='/newsdetail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/NewsDetail').default)
            }, 'NewsDetail')
        }}/>
        <Route path='/newcoins' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/NewCoins').default)
            }, 'NewCoins')
        }}>
            <IndexRoute getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/NewCoins/CoinsList').default)
                }, 'NewCoinsIndex')
            }}/>
            <Route path='/newcoinsList' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/NewCoins/CoinsList').default)
                }, 'NewCoinsList')
            }}/>
            <Route path='/newcoinsDetail' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/NewCoins/CoinsDetail').default)
                }, 'NewCoinsDetail')
            }}/>
        </Route>
        }}/>
        <Route path='/project' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Project').default)
            }, 'Project')
        }}>
            <IndexRoute getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/ProjectMaterial').default)
                }, 'ProjectIndex')
            }}/>
            <Route path='/projectInfo' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/Project/Info').default)
                }, 'Info')
            }}/>
            <Route path='/projectProjectmaterial' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/ProjectMaterial').default)
                }, 'ProjectMaterial')
            }}/>
            <Route path='/projectRelatenews' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/Project/RelateNews').default)
                }, 'RelateNews')
            }}/>
        </Route>
        <Route path='/exchangelist' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/ExchangeList').default)
            }, 'ExchangeList')
        }}/>
        <Route path='/copyright' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Copyright').default)
            }, 'Copyright')
        }}/>
        <Route path='/about' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/About').default)
            }, 'About')
        }}/>
        <Route path='/user' onEnter={isLogined} getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/User/hxh').default)
                // callback(null, require('../containers/User').default)
            }, 'User')
        }}>
            <IndexRoute getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/MyInformation/hxh').default)
                    // callback(null, require('../containers/User/MyInformation').default)
                }, 'UserIndex')
            }}/>
            <Route path='/userMyAttention' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/MyAttention').default)
                }, 'Attention')
            }}>
                <IndexRoute getComponent={(nextState, callback) => {
                    require.ensure([], (require) => {
                        callback(null, require('../containers/User/AttentionProject').default)
                    }, 'MyAttention')
                }}/>
                <Route path='/userMyAttentionProject' getComponent={(nextState, callback) => {
                    require.ensure([], (require) => {
                        callback(null, require('../containers/User/AttentionProject').default)
                    }, 'AttentionProject')
                }}/>
                <Route path='/userMyAttentionAuthor' getComponent={(nextState, callback) => {
                    require.ensure([], (require) => {
                        callback(null, require('../containers/User/AttentionAuthor').default)
                    }, 'AttentionAuthor')
                }}/>
            </Route>
            <Route path='/userMyArticle' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/MyArticle').default)
                }, 'MyArticle')
            }}/>
            <Route path='/userMyInfo' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/MyInformation/hxh').default)
                    // callback(null, require('../containers/User/MyInformation').default)
                }, 'MyInformation')
            }}/>
            <Route path='/userBindingPhone' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/BindingPhone').default)
                }, 'BindingPhone')
            }}/>
            <Route path='changePhoneEml' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/ChangePhoneEml').default)
                }, 'ChangePhoneEml')
            }}/>
            <Route path='/userChangePassword' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/ChangePassWord/hxh').default)
                    // callback(null, require('../containers/User/ChangePassWord').default)
                }, 'ChangePassWord')
            }}/>
            <Route path='/userMyCollection' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/MyCollection').default)
                }, 'MyCollection')
            }}/>
            <Route path='/userCertification' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/User/Certification').default)
                }, 'Certification')
            }}/>
        </Route>
        <Route path='/edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/EditArticle').default)
            }, 'EditArticle')
        }}/>
        <Route path='/search' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Search').default)
            }, 'Search')
        }}/>
        <Route path='/live' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Lives').default)
            }, 'Lives')
        }}>
            <IndexRoute getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/Lives/liveList').default)
                }, 'LiveIndex')
            }}/>
            <Route path='/live/liveList' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/Lives/liveList').default)
                }, 'LiveList')
            }}/>
            <Route path='/live/liveDetails' getComponent={(nextState, callback) => {
                require.ensure([], (require) => {
                    callback(null, require('../containers/Lives/liveDetails').default)
                }, 'LivesDetails')
            }}/>
        </Route>
        <Route path='/app' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/DownLoad').default)
            }, 'app')
        }}/>
        <Route path='/hot' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/HotLabel').default)
            }, 'hot')
        }}/>
    </Route>
    <Route path='/showSpecial' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/ShowSpecial').default)
        }, 'showSpecial')
    }}/>
    <Route path='/showSpecialNews' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/ShowSpecial/newsList').default)
        }, 'showSpecialNews')
    }}/>
    <Route path='/wbcworld' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Exhibition').default)
        }, 'showSpecial')
    }}/>
    <Route path='/wbcworldNews' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Exhibition/newsList').default)
        }, 'showSpecialNews')
    }}/>
</div>

export default rootRoutes
