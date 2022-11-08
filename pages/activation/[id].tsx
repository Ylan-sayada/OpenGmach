import axios from 'axios'
import { useRouter } from 'next/router'

const Activation = () => {
    let router = useRouter();
    let { id } = router.query;
    axios.put("http://localhost:3000/api/activation", id).then((res) => {
        console.log(res);
        router.push("/")
    })
    console.log(id)
    return null
}

export default Activation
