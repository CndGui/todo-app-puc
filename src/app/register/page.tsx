export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Criar conta</h1>
        <p className="text-sm text-gray-500 mb-6">TaskSchool — Gestão de tarefas escolares</p>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Você é:</label>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-2 rounded border text-sm font-medium bg-blue-600 text-white border-blue-600 cursor-pointer"
              >
                Estudante
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded border text-sm font-medium bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Professor
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 cursor-pointer"
          >
            Cadastrar
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Já tem conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}
