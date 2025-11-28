// app/about/page.js

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Grupul de Tineret</h2>
          {/* Corecție AICI: Am folosit un <span> pentru a bolda și colora numele grupului */}
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Suntem <span className="text-indigo-600">CONNECT</span>! 🚀
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
            Locul unde adolescenții din Lunca se întâlnesc săptămânal pentru distracție, prietenie și un mesaj care contează.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Secțiune 1: Când și Unde */}
            <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-indigo-500">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">🗓️ Când ne vedem?</h3>
              {/* Corecție AICI: Am folosit tag-ul <strong> pentru bold */}
              <p className="mt-3 text-lg text-gray-700">
                În fiecare <strong>JOI</strong> de la ora <strong>18:30</strong>. Vă așteptăm cu drag!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Unde? La JKOCURI (Centrul de Tineret).
              </p>
            </div>

            {/* Secțiune 2: Jocuri și Gustare */}
            <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-purple-500">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15.75L15 12 11 8.25m-2.25 11.25H21a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">🎮 Distracție și Energie</h3>
              {/* Corecție AICI: Am folosit tag-ul <strong> pentru bold */}
              <p className="mt-3 text-lg text-gray-700">
                Începem cu <strong>jocuri</strong> super tari și ne reîncărcăm bateriile cu o <strong>gustare</strong> delicioasă.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Nu uita să vii cu poftă de joacă și de râs!
              </p>
            </div>

            {/* Secțiune 3: Cuvântul lui Dumnezeu */}
            <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13M3.327 12.003h18.346m-8.995-5.75l5.58 5.75-5.58 5.75M8.41 17.513l-5.58-5.75 5.58-5.75" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">🙏 Un Cuvânt pentru Viață</h3>
              {/* Corecție AICI: Am folosit tag-ul <strong> pentru bold */}
              <p className="mt-3 text-lg text-gray-700">
                În a doua parte, ne conectăm la sursă și vorbim despre <strong>Cuvântul lui Dumnezeu</strong> într-un mod relevant pentru tine.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Întrebări, discuții deschise și multă inspirație.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Vino și Conectează-te!</h3>
             <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-lg"
              >
                Vreau să vin la Connect
              </a>
          </div>
        </div>
      </div>
    </div>
  );
}