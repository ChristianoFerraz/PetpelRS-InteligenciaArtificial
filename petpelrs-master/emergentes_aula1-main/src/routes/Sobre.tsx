import React from 'react';

const Sobre: React.FC = () => {
    return (
        <>
        <div className="max-w-2xl mx-auto p-6 mt-10 ">
            <h1 className="text-3xl font-bold mb-4 text-blue-700">Sobre o Aplicativo</h1>
            <p className="mb-4 text-gray-700">
                Este projeto está sendo desenvolvido para auxiliar na busca por pets perdidos na cidade de Pelotas.
                A plataforma oferece diversas funcionalidades para ajudar tutores e amantes de animais:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li><strong>Consultar uma lista de animais encontrados;</strong></li>
                <li><strong>Cadastrar pets localizados;</strong></li>
                <li><strong>Visualizar animais disponíveis para adoção.</strong></li>
            </ul>
            <p className="mb-4 text-gray-700">
                Além disso, o App também vai oferecer <strong>futuramente</strong> recursos para facilitar o dia a dia do seu pet:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li>Lembretes de vacinas e atividades;</li>
                <li>Dicas de alimentação;</li>
                <li>Possibilidade de marcar consultas com veterinários e adestradores.</li>
            </ul>
            <p className="text-gray-700">
                Nosso objetivo é conectar pessoas e promover o bem-estar dos animais, tornando a busca por pets perdidos mais eficiente e oferecendo suporte completo para os cuidados diários.
            </p>
        </div>
<footer className='max-w-2xl mx-auto p-6 mt-10'>
    <div className="mx-auto p-2 mt-10 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Contato</h2>
        <p className="mb-2 text-gray-700">
            Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato:
        </p>
            <div><strong>Email:</strong> anthonymartins19977@gmail.com</div>
            <div className='flex items-center'>
                <p><strong>(53) 98170-6490</strong> ou Clique no logo ao lado</p>
                <a href="https://w.app/petpelrs"><img className='h-20' src="/img/logozap.png" alt="Logo Whatsapp" /> </a>
            </div>
        
    </div>
</footer>
        </>
    );
};

export default Sobre;