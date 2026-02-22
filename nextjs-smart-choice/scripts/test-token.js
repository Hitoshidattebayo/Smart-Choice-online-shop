const { createClient } = require('@sanity/client');

const token = "skJRZ1tPAYtL1OUbuYxWoCrl6aKJEJjG1gPQ9KD9eowuvOvSf3c8YA9njVzTkAlD5PtpanICxSjNrkDVkDoaWFEJDPfK9bnbtHVQYRJz4T9krwYFFp68N70j4K0tfowWO77Xzi1a7oYCbmVDO7KJAZzc8CazaHB5lZQzTHyqfu6my7CjbwNy";

console.log('Token starts with:', token.substring(0, 10));

const client = createClient({
    projectId: 'eiivfy8o',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: token,
});

async function test() {
    try {
        const result = await client.fetch('*[_type == "product"][0]{name, stockQuantity}');
        console.log('SUCCESS - Product:', result);
    } catch (err) {
        console.error('ERROR:', err.message);
        console.log('Status code:', err.statusCode);
    }
}

test();
