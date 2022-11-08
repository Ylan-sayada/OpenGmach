import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import styles from '../styles/Key4Log.module.scss'

const Key4Log: NextPage = () => {
  const [error, setError] = useState(false);
  const router = useRouter();
  return (
    <div >
      <Head>
        <title>Submit your key and get started!</title>
        <meta name="description" content="Not initialized gmach" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id={styles.key4Log}>
        <header>
          <h1>Open Gmach</h1>
          <h3>Initialization</h3>
        </header>
        <article>
          <Form onSubmit={async (e) => {
            e.preventDefault();
            let response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/key4Log`, { key: e.currentTarget.key.value });
            if (response.data.continue) {
              localStorage.setItem("initToken", JSON.stringify(response.data.token))
              router.push("/Init")
            } else {
              setError(true)
            }
          }}>
            {error && <Alert variant='danger'>The Key4Log is not valid</Alert>}
            <Form.Label>Submit the Key4Log : </Form.Label>
            <Form.Control type="text" name="key" placeholder="XXXX-XXXX-XXXX-XXXX" />
            <Button type="submit">Lets get started!</Button>
          </Form>
        </article>


      </main>

    </div>
  )
}

export default Key4Log
