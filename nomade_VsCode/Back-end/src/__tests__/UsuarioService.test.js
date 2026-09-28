const UsuarioService = require("../services/UsuarioService")

describe("UsuarioService", () => {
    let service
    let mockRepository

    beforeEache(() => {
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail:jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }

        service = new UsuarioService(mockRepository)
    })

    
})