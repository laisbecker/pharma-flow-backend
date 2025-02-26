export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
  
  export const validateCPF = (cpf: string): boolean => {

    return cpf.length === 11
  }
  
  export const validateCNPJ = (cnpj: string): boolean => {

    return cnpj.length === 14
  }