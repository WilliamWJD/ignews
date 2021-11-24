import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client';
import { stripe } from "../../services/stripe";

export default async (req:NextApiRequest, res:NextApiResponse) => {
    if(req.method==='POST'){
        const session = await getSession({ req })

        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
            // metadata
        })

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            //QUEM ESTÁ COMPRANDO / ID DO CUSTOMER NO STRIPE
            customer: stripeCustomer.id,
            //TIPOS DE PAGAMENTO ACEITOS
            payment_method_types: ['card'],
            //OBRIGATÓRIO INFORMAR ENDEREÇO DO CLIENTE
            billing_address_collection: 'required',
            //INFORMAÇÕES REFERENTE AO VALOR E QUANTIDADE DO PLANO
            line_items: [
                { price: 'price_1Jr3gNALEc8VA9QdvHav2t36', quantity: 1 }
            ],
            mode: 'subscription',
            //HABILITA FUTURAS PROMOÇÕES COMO CUPOM DE DESCONTOS
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    }else{
        res.setHeader('Allow','POST')
        res.status(405).end('Method not allowed')
    }
}