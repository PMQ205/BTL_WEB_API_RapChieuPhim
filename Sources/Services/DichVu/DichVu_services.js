import { dichVu_Repo } from '../../repositories/DichVu_repo.js'

export const dichVu_Services = {
  getAll_Service: async () => {
    return await dichVu_Repo.getAll_Repo()
  },
  getById_Service: (id) => dichVu_Repo.getById_Repo(id),
}
