import country from './country'

describe("Country",()=>{
    const initialState={
        countryList: [],
        allCountryList: [],
        allArticles: [],
        countryArticles: [],
        allCountry: [],
        expertData: {},
        expertLoading: {},
        blogData: {},
        blogLoading: {},
        alertLoading: {},
        alertData: {},
        loading: false,
        articleContent: [],
        lifeCycleData: [],
        allArticlesLoading: true,
        employeeCount: '',
        CountryDetails: [],
        solutionId: '',
        SnapShotData: [],
        topicsLoading: false,
        popularContentForCountry: [],
        attractId: [],
        onBoardId: [],
        developId: [],
        offBoardId: [],
        specificLifecycleData: [],
        regionList: [],
        addedtofav: {},
        holidayList: [],
        globalLoader: false,
        companyDetails: [],
        countryStatus: {
          countryaddedErr: undefined,
          detetedSuccess: false,
          deleteErr: undefined,
          countryadded: false,
        },
      }
    test("should return the initial state",()=>{
        expect(country(undefined,{})).toEqual(initialState)
    })
    test("should handle CountryList fulfilled",()=>{
        expect(country(initialState,{
            type:'country/getUserCountryList/fulfilled',
            payload:{data:[{id:1},{id:2}]}
        })).toEqual({...initialState,countryList: [{"id": 1}, {"id": 2}],userCountryLoading: false})
    })
    test("should handle CountryList pending",()=>{
        expect(country(initialState,{type:'country/getUserCountryList/pending',meta:{arg:{id:'6cf12b72-a704-492d-b7c7-b97626d87d73'},requestId:'_oGhY-Oqh70scKVqv1CD4',requestStatus:'pending'}
        })).toEqual({...initialState,userCountryLoading: true})
    })

    test("should handle AlertFulfilled",()=>{
        expect(country(initialState,{
            type:'country/getCountryAlerts/fulfilled',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                arg: {
                countryName: 'Singapore',
                data: {
                solutionId: '60bdb88f86a0c57df354a392',
                Tag: [
                'Singapore'
                ]
                }
                },
                requestId: '0565dPj3K-oMEQeHX-ltc',
                requestStatus: 'fulfilled'
                }
        })).toEqual({...initialState,alertData: {Singapore:[{"id": 1}, {"id": 2}]},alertLoading:{"Singapore": false}})
    })

    test("should handle AlertPending",()=>{
        expect(country(initialState,{
            type:'country/getCountryAlerts/pending',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                arg: {
                countryName: 'Singapore',
                data: {
                solutionId: '60bdb88f86a0c57df354a392',
                Tag: [
                'Singapore'
                ]
                }
                },
                requestId: '0565dPj3K-oMEQeHX-ltc',
                requestStatus: 'pending'
                }
        })).toEqual({...initialState,alertLoading:{"Singapore": true}})
    })

    test("should handle countryexpert fulfilled",()=>{
        expect(country(initialState,{
            type:'country/getCountryExpert/fulfilled',
            payload:{countryName:'Argentina'},
            meta: {
                arg: {
                countryName: 'Argentina',
                data: {
                solutionId: '60a4dab59a45af400f74d2e0',
                Tag: [
                'Argentina'
                ],
                ShowTopicHierarchy:true
                }
                },
                requestId: 'RkwDCJK6DsCWzgPrb3eqm',
                requestStatus: 'fulfilled'
                }
        })).toEqual({...initialState,expertLoading:{Argentina:false}})
    })
    test("should handle countryexpert pending",()=>{
        expect(country(initialState,{
            type:'country/getCountryExpert/pending',
            payload:{countryName:'Argentina'},
            meta: {
                arg: {
                countryName: 'Argentina',
                data: {
                solutionId: '60a4dab59a45af400f74d2e0',
                Tag: [
                'Argentina'
                ],
                ShowTopicHierarchy:true
                }
                },
                requestId: 'RkwDCJK6DsCWzgPrb3eqm',
                requestStatus: 'pending'
                }
        })).toEqual({...initialState,expertLoading:{Argentina:true}})
    })
    test("should handle popularCountry fulfilled",()=>{
        expect(country(initialState,{
            type:'country/getPopularCountryList/fulfilled',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                requestId: 'RdNQ6Vr7aafe4dTxtAUzq',
                requestStatus: 'fulfilled'
                }
        })).toEqual({...initialState,popularCountryList: [{"id": 1}, {"id": 2}]})
    })
    test("should handle popularCountry pending",()=>{
        expect(country(initialState,{
            type:'country/getPopularCountryList/pending',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                requestId: 'RdNQ6Vr7aafe4dTxtAUzq',
                requestStatus: 'pending'
                }
        })).toEqual({...initialState})
    })

    test("should handle popularContent fulfilled",()=>{
        expect(country(initialState,{
            type:'country/getPopularContentList/fulfilled',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                requestId: '3_XU72ZYcohWKh_biBpnJ',
                requestStatus: 'fulfilled'
                }
        })).toEqual({...initialState,popularContent: [{"id": 1}, {"id": 2}]})
    })
    test("should handle popularContent pending",()=>{
        expect(country(initialState,{
            type:'country/getPopularContentList/pending',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                requestId: '3_XU72ZYcohWKh_biBpnJ',
                requestStatus: 'pending'
                }
        })).toEqual({...initialState})
    })

   
    test("should handle BlogSolutionId fulfilled",()=>{
        expect(country(initialState,{
            type:'country/getBlogSolutionId/fulfilled',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                arg:{count:1},
                requestId: 'oUUVm0dJwygT28_S0cdIt',
                requestStatus: 'fulfilled'
                }
        })).toEqual({...initialState,blogSolutions: [{"id": 1}, {"id": 2}]})
    })
    test("should handle BlogSolutionId pending",()=>{
        expect(country(initialState,{
            type:'country/getBlogSolutionId/pending',
            payload:{data:[{id:1},{id:2}]},
            meta: {
                arg:{count:1},
                requestId: 'oUUVm0dJwygT28_S0cdIt',
                requestStatus: 'pending'
                }
        })).toEqual({...initialState})
    })

    test("should handle ExpertSolutionId fulfilled",()=>{
        expect(country(initialState,{
            type:"country/getExpertSolutionId/fulfilled",
            payload:{data:[{id:1},{id:2}]},
            meta: {
                arg:{count:1},
                requestId: '-RPvzh5LB9l_OFi6UfEdw',
                requestStatus: 'fulfilled'
                }
        })).toEqual({...initialState,expertSolutions: [{"id": 1}, {"id": 2}]})
    })
    test("should handle ExpertSolutionId pending",()=>{
        expect(country(initialState,{
            type:"country/getExpertSolutionId/pending",
            payload:{data:[{id:1},{id:2}]},
            meta: {
                arg:{count:1},
                requestId: '-RPvzh5LB9l_OFi6UfEdw',
                requestStatus: 'pending'
                }
        })).toEqual({...initialState})
    })
    test("should handle countryBlogs fulfilled",()=>{
        expect(country(initialState,{
            type:"country/getCountryBlogs/fulfilled",
            payload:{res:{data:[{id:1},{id:2}]},
            countryName:"Argentina"},
            meta: {
                arg:{countryName:"Argentina",data:{solutionId:"60bdb88f86a0c57df354a392",Tag:["Argentina"]}},
                requestId: 'Nibxr9_npfnUGe_u_m14d',
                requestStatus: 'fulfilled'
                }
        })).toEqual({...initialState,blogData: {"Argentina": [{"id": 1}, {"id": 2}]},blogLoading: {"Argentina": false}})
    })
    test("should handle countryBlogs pending",()=>{
        expect(country(initialState,{
            type:"country/getCountryBlogs/pending",
            payload:{res:{data:[{id:1},{id:2}]},
            countryName:"Argentina"},
            meta: {
                arg:{countryName:"Argentina",data:{solutionId:"60bdb88f86a0c57df354a392",Tag:["Argentina"]}},
                requestId: 'Nibxr9_npfnUGe_u_m14d',
                requestStatus: 'pending'
                }
        })).toEqual({...initialState,blogLoading:{ "Argentina": true}})
    })

})
